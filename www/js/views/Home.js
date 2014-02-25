define(['underscore', 'backbone', 'src/App'], function(_, Backbone, App) {
    'use strict';

    var Home = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = options.template;
            this.listenTo(this.model, 'change', this.render);
            App.startGeolocation();
        },

        events: {
            "click #homeImage": "onImageClicked",
            "click #btnHomeExtras": "onExtrasClicked"
        },

        onImageClicked: function() {
            var site = this.model.get('site');
            var operation = this.getOperation(site);
            switch (operation) {
                case App.operationTypes.ERROR:
                    break;
                case App.operationTypes.UNADDRESSED:
                    App.stopGeolocation();
                    App.pageRouter.navigate('placement', {trigger: true, replace: true});
                    break;
                case App.operationTypes.PLACED || App.operationTypes.MIDSEASON:
                    alert("Inspections are not implemented");
                    break;
                case App.operationTypes.FINAL:
                    break;
                case App.operationTypes.OMITTED:
                    break;
            }
        },

        onExtrasClicked: function() {
            App.stopGeolocation();
            App.pageRouter.navigate('extras', {trigger: true, replace: true});
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.checkTargetCircle(null);
            return this;
        },

        checkTargetCircle: function () {
            var relativePosition = this.model.get('relativePosition');
            var isOut = relativePosition.DistanceOutside > 0;
            var site = this.model.get('site');

            var color = this.getColor(isOut);
            var imageSource = this.getOperationImage(isOut, site);

            this.$el.find('#siteDiv').css('background-color', color);
            this.$el.find('#homeImage').attr('src', imageSource);
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
                site.trap_type;
                imagePath = site.trap_type === 'Delta' ? 'Delta' : 'MilkCarton';
            }
            return imagePath;
        },

        getOperation: function(site) {
            var operationType = '';
            if (site.quad === '') {
                operationType = App.operationTypes.ERROR;
            } else if (typeof site.xact === 'undefined') {
                operationType = App.operationTypes.UNADDRESSED;
            } else if (typeof site.visit === 'undefined') {
                if (typeof site.omit_reason === 'undefined') {
                    operationType = App.operationTypes.PLACED;
                } else {
                    operationType = App.operationTypes.OMITTED;
                }
            } else if (site.visit === 'MIDSEASON') {
                operationType = App.operationTypes.MIDSEASON;
            } else {
                operationType = App.operationTypes.FINAL;
            }
            return operationType;
        }
    });

    return Home;
});
