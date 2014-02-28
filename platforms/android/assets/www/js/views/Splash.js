define(['underscore',
    'backbone'
], function(_, Backbone) { 'use strict';

    var SplashView = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = options.template;
            this.listenTo(this.model, 'change:message', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return SplashView;
});
