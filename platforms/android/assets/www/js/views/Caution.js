define(['underscore',
    'backbone',
    'src/App'
], function(_, Backbone, App) {
    'use strict';

    var Caution = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = options.template;
        },

        events: {
            "click #btnCautionOk": "onOkClicked",
            "click #btnCautionCancel": "onCancelClicked"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onOkClicked: function() {
            App.pageRouter.navigate('confirm', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            App.pageRouter.navigate('home', {trigger: true, replace: true});
        }
    });

    return Caution;
});
