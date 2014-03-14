define(['underscore',
    'backbone',
    'src/util/Geolocation',
    'src/util/Encoder',
    'src/util/Controller'
], function(_, Backbone, Geolocation, Encoder, Controller) { 'use strict';

    var Home = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = options.template;
            this.listenTo(this.model, 'change', this.render);
            Geolocation.start();
        },

        events: {
            "click #homeImage": "onImageClicked",
            "click #btnHomeExtras": "onExtrasClicked"
        },

        onImageClicked: function() {
            var site = this.model.get('nearestSites').first().get('site');
            var operation = this.getOperation(site);
            switch (operation) {
                case Encoder.operationTypes.ERROR:
                    break;
                case Encoder.operationTypes.UNADDRESSED:
                    Geolocation.stop();
                    Controller.router.navigate('placement', {trigger: true, replace: true});
                    break;
                case Encoder.operationTypes.PLACED || Encoder.operationTypes.MIDSEASON:
                    alert("Inspections are not implemented");
                    break;
                case Encoder.operationTypes.FINAL:
                    break;
                case Encoder.operationTypes.OMITTED:
                    break;
            }
        },

        onExtrasClicked: function() {
            Geolocation.stop();
            Controller.router.navigate('extras', {trigger: true, replace: true});
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.checkTargetCircle();
            return this;
        },

        checkTargetCircle: function () {
            var nearest = this.model.get('nearestSites').first(),
                relativePosition, isOut, site, color, imageSource;
            if (nearest !== null) {
                relativePosition = nearest.get('relativePosition');
                isOut = relativePosition.get('distanceOutside') > 0;
                site = nearest.get('site');
                color = this.getColor(isOut);
                imageSource = this.getOperationImage(isOut, site);

                this.$el.find('#siteDiv').css('background-color', color);
                this.$el.find('#homeImage').attr('src', imageSource);
            }
        },

        getColor: function(isOut) {
            return isOut ? '#FF0000' : '#799839';
        },

        getOperationImage: function(isOut, site) {
            var imagePath = 'img/';
            imagePath += isOut ? 'red' : 'green';
            imagePath += this.getImageType(site);
            imagePath += '.gif';
            return imagePath;
        },

        getImageType: function(site) {
            var imagePath = '';
            if (typeof site.xact === 'undefined') {
                imagePath = 'Tree';
            } else if (typeof site.visit === 'undefined') {
                imagePath = site.trap_type === 'Delta' ? 'Delta' : 'MilkCarton';
            }
            return imagePath;
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
        }
    });

    return Home;
});
