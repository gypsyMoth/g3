define(['underscore',
    'backbone'
], function(_, Backbone) { 'use strict';

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
            Backbone.history.navigate('confirm', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            Backbone.history.navigate('home', {trigger: true, replace: true});
        }
    });

    return Caution;
});
