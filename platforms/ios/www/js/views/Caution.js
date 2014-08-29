define(['underscore',
    'backbone',
    'src/util/Controller',
    'text!src/templates/caution.html'
], function(_, Backbone, Controller, cautionTemplate) { 'use strict';

    var Caution = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = _.template(cautionTemplate);
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
            Controller.router.navigate('confirm', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        }
    });

    return Caution;
});
