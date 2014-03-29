define(['underscore',
    'backbone',
    'text!src/templates/splash.html'
], function(_, Backbone, splashTemplate) { 'use strict';

    var SplashView = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = _.template(splashTemplate);
            this.listenTo(this.model, 'change:message', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return SplashView;
});
