define(['underscore',
    'backbone',
    'src/App'
], function(_, Backbone, App) {
    'use strict';

    var SplashView = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = options.template;
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
            App.pageRouter.navigate('home', {trigger: true, replace: true});
        }
    });

    return SplashView;
});
