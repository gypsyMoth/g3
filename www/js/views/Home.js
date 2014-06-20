define(['underscore',
    'backbone',
    'src/util/Geolocation',
    'src/util/Encoder',
    'src/util/Date',
    'src/util/Controller',
    'text!src/templates/home.html'
], function(_, Backbone, Geolocation, Encoder, DateFormatter, Controller, homeTemplate) { 'use strict';

    var Home = Backbone.View.extend({

        tagName: "div",

        className: "view",

        previousCircleStatus: false,

        initialize: function(options) {
            this.model.clearOperation();
            this.template = _.template(homeTemplate);
            this.render();
            //this.listenTo(this.model, 'change:manualLock', this.updateLockIcon);
            //this.listenTo(this.model.get('selectedSite').get('relativePosition')., 'change:selected')
            this.listenTo(this.model, 'change', this.render);
            Geolocation.updateModel();
            Geolocation.start();

        },

        events: {
            "click #homeImage": "onImageClicked",
            "click #btnHomeExtras": "onExtrasClicked"
        },

        updateLockIcon: function() {
            var lock, isLocked;
            lock = this.$el.find('#lockDiv');
            isLocked = this.model.get('manualLock');
            if(isLocked) {
                lock.css('visibility', 'visible');
            } else {
                lock.css('visibility', 'hidden');
            }
        },

        updateInspectIcon: function() {
            var ins, inspected;
            ins = this.$el.find('#inspectDiv');
            inspected = this.model.get('selectedSite').get('site').visit;
            if(inspected) {
                ins.css('visibility', 'visible');
            } else {
                ins.css('visibility', 'hidden');
            }
        },

        onClose: function(){
            Geolocation.stop();
            this.model.unbind("change:selectedSite", this.render);
        },

        onImageClicked: function() {
            var site = this.model.get('selectedSite').get('site');
            var operation = this.getOperation(site);
            switch (operation) {
                case Encoder.operationTypes.ERROR:
                    break;
                case Encoder.operationTypes.UNADDRESSED:
                    Geolocation.stop();
                    Controller.router.navigate('placement', {trigger: true, replace: true});
                    break;
                case Encoder.operationTypes.PLACED:
                case Encoder.operationTypes.MIDSEASON:
                    Geolocation.stop();
                    var txn_date = this.model.get('selectedSite').get('site').txn_date;
                    if (txn_date === DateFormatter.getSitesFormatDate(Date.now())) {
                        alert("Site cannot be placed and inspected or inspected twice on the same day!");
                        Geolocation.start();
                    } else {
                        Controller.router.navigate('inspection', {trigger: true, replace: true});
                    }
                    break;
                case Encoder.operationTypes.FINAL:
                    alert("Final Inspection has been completed!");
                    break;
                case Encoder.operationTypes.OMITTED:
                    alert("Site omitted!");
                    break;
            }
        },

        getOperation: function(site) {
            var operationType = '';
            if (site.quad === '') {
                operationType = Encoder.operationTypes.ERROR;
            } else if (typeof site.xact === 'undefined') {
                operationType = Encoder.operationTypes.UNADDRESSED;
            } else if (typeof site.visit === 'undefined') {
                if (typeof site.omit_reason === 'undefined') {
                    operationType = Encoder.operationTypes.PLACED;
                } else {
                    operationType = Encoder.operationTypes.OMITTED;
                }
            } else if (site.visit === 'MIDSEASON') {
                operationType = Encoder.operationTypes.MIDSEASON;
            } else {
                operationType = Encoder.operationTypes.FINAL;
            }
            return operationType;
        },

        onExtrasClicked: function() {
            Geolocation.stop();
            Controller.router.navigate('extras', {trigger: true, replace: true});
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.updateLockIcon();
            this.updateInspectIcon();
            this.checkTargetCircle();
            return this;
        },

        tryBeep: function(isOut) {
            if (this.previousCircleStatus !== isOut) {
                navigator.notification.beep(1);
                this.previousCircleStatus = isOut;
            }
        },

        checkTargetCircle: function () {
            var nearest = this.model.get('selectedSite'),
                relativePosition, isOut, site, color, imageSource;
            if (nearest !== null) {
                relativePosition = nearest.get('relativePosition');
                isOut = relativePosition.get('distanceOutside') > 0;
                site = nearest.get('site');
                color = this.getColor(isOut);
                imageSource = this.getOperationImage(isOut, site);

                this.$el.find('#siteDiv').css('background-color', color);
                this.$el.find('#homeImage').attr('src', imageSource);

                this.tryBeep(isOut);
            }
        },

        getColor: function(isOut) {
            return isOut ? '#FF0000' : '#799839';
        },

        getOperationImage: function(isOut, site) {
            var imagePath = 'img/';
            if (site.omit_reason) {
                imagePath += 'omittedTree';
            } else {
                imagePath += isOut ? 'red' : 'green';
                imagePath += this.getImageType(site);
            }
            imagePath += '.gif';
            return imagePath;
        },

        getImageType: function(site) {
            var imagePath = '';
            if (typeof site.xact === 'undefined') {
                imagePath = 'Tree';
            } else {
                imagePath = site.trap_type === 'Delta' ? 'Delta' : 'MilkCarton';
            }
            return imagePath;
        }

    });

    return Home;
});
