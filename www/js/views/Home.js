/* Created by Ian on 1/15/14.*/
$(function () {
    'use strict';

    app.views.Home = Backbone.View.extend({

        tagName: "div",

        className: "view",

        template: _.template($('#home-template').html()),

        initialize: function() {
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

            this.$el.html(this.template(this.model.toJSON()));
            this.checkTargetCircle();
            return this;
        },

        checkTargetCircle: function () {
            var site = this.model.get('nearestSite');
            $('#siteDiv').css('background-color', site.Outside ? 'red' : '#799839');
            $('#homeImage').attr('src', site.Outside ? 'img/redTree.gif' : 'img/greenTree.gif');
        }
    });
});
