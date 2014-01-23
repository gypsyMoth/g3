/* Created by Ian on 1/20/14.*/
$(function () {
    'use strict';

    app.views.Splash = Backbone.View.extend({

        tagName: "div",

        className: "view",

        template: _.template($('#splash-template').html()),

        initialize: function() {
            this.listenTo(this.model, 'change:message', this.render);
            this.listenTo(this.model, 'change:gotSignal', this.gotGpsSignal);
        },

        events: {

        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        gotGpsSignal: function() {
            app.pageRouter.navigate('home', {trigger: true, replace: true});
        }
    });
});
