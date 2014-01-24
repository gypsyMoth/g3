/* Created by Ian on 1/15/14.*/
(function () {
    'use strict';

    app.views.Home = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = options.template;
            app.startGeolocation();
            this.listenTo(this.model, 'change', this.render);
        },

        events: {
            "click #homeImage": "onImageClicked",
            "click #btnHomeExtras": "onExtrasClicked"
        },

        onImageClicked: function() {
            app.stopGeolocation();
            app.pageRouter.navigate('placement', {trigger: true, replace: true});
        },

        onExtrasClicked: function() {
            app.stopGeolocation();
            app.pageRouter.navigate('extras', {trigger: true, replace: true});
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
            var imageSource = this.getOperation(isOut, site);

            this.$el.find('#siteDiv').css('background-color', color);
            this.$el.find('#homeImage').attr('src', imageSource);
        },

        getColor: function(isOut) {
            return isOut ? '#FF0000' : '#799839';
        },

        getOperation: function(isOut, site) {
            var imagePath = 'img/';
            imagePath += isOut ? 'red' : 'green';

            if (typeof site.xact === 'undefined') {
                imagePath += 'Tree';
            } else if (typeof site.visit === 'undefined') {
                site.trap_type;
                imagePath += site.trap_type === 'Delta' ? 'Delta' : 'MilkCarton';
            }
            imagePath += '.gif';
            return imagePath;
        }
    });
})();
