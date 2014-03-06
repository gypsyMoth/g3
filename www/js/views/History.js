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
            "click #btnHistoryNext": "onNextClicked",
            "click #btnHistoryClose": "onCloseClicked"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onNextClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        },

        onCloseClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        }
    });

    return History;
});
