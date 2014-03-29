define(['jquery',
    'underscore',
    'backbone',
    'text!templates/omit.html',
    'src/util/Controller'
], function($, _, Backbone, omitTemplate, Controller) {
    'use strict';

    var Omit = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = _.template(omitTemplate);
        },

        events: {
            "click #btnOmitOk": "onOkClicked",
            "click #btnOmitCancel": "onCancelClicked",
            "change #selectOmitReason": "onOmitReasonChanged"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onOmitReasonChanged: function(e) {
            var selectedOmitReason = e.target.options[e.target.selectedIndex].value;
            this.omitReason = selectedOmitReason;
        },

        onOkClicked: function() {
            this.model.operation.traptype = this.omitReason;
            Controller.router.navigate('home', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        }
    });

    return Omit;
});
