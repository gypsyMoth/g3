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
            "click #homeImage": "onImageClicked"
        },

        onImageClicked: function() {
            app.stopGeolocation();
            app.pageRouter.navigate('placement', true);
        },

        render: function() {

            //var e = this.template(this.model.toJSON());
            this.$el.html(this.template(this.model.toJSON()));
            this.checkTargetCircle(null);
            return this;
        },

        checkTargetCircle: function (html) {
            var site = this.model.get('nearestSite');
            var isOut = site.DistanceOutside > 0;
            this.$el.find('#siteDiv').css('background-color', isOut ? 'red' : '#799839');
            this.$el.find('#homeImage').attr('src', isOut ? 'img/redTree.gif' : 'img/greenTree.gif');
            return html;
        }
    });
})();
