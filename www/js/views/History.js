define(['underscore', 
    'backbone',
    'src/util/DB',
    'src/util/Controller'
], function(_, Backbone, DB, Controller) {
    'use strict';

    var History = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = options.template;
        },

        events: {
            "click #btnHistoryClose": "onCloseClicked"
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        },

        onCloseClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        }
    });

    return History;
});
