define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/omit.html',
    'src/util/Controller'
], function($, _, Backbone, omitTemplate, Controller) {
    'use strict';

    var Omit = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = options.template;
            this.setOperation({text: 'Nothing to hang trap on', value: 'H'});
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
            var selectedOption = e.target.options[e.target.selectedIndex];
            this.setOperation(selectedOption);
        },

        onOkClicked: function() {
            Controller.router.navigate('confirm', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        },

        setOperation: function(option) {
            var op = this.model.get('operation');
            op.traptype = "Omit";
            op.omitReason = option.text;
            op.omitCode = option.value;
        }
    });

    return Omit;
});
