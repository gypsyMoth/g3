define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/inspection.html',
    'src/util/Controller'
], function($, _, Backbone, inspectionTemplate, Controller) {
    'use strict';

    var Inspection = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = _.template(inspectionTemplate);
            this.setDefaultOperation({condition: 'G', visit: 'M', mothCount: 0});
        },

        events: {
            "click #btnInspectionOk": "onOkClicked",
            "click #btnInspectionCancel": "onCancelClicked",
            "change #selectInspectionType": "onTypeChanged",
            "change #selectCondition": "onConditionChanged",
            "change #mothCount": "onMothCountChanged"
        },

        allowMothCount: function(insType) {
            if (insType === 'G' || insType === 'D'){
                $("#enterCount").show();
            } else {
                $("#enterCount").hide();
                resetCatch();
            }
        },

        resetCatch: function() {
            var op = this.model.get("operation");
            op.catch = 0;
            $("#mothCount").val(op.catch);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onTypeChanged: function(e) {
            var selectedOption = e.target.options[e.target.selectedIndex];
            this.model.get('operation').visit = selectedOption.value;
        },

        onConditionChanged: function(e) {
            var selectedOption = e.target.options[e.target.selectedIndex];
            this.model.get('operation').condition = selectedOption.value;
            this.allowMothCount(selectedOption.value);
        },

        onMothCountChanged: function(e) {
            var newVal = e.target.value;
            if (0 < newVal < 999) {
                this.model.get('operation').catch = e.target.value;
            } else {
                alert("Invalid moth count! Maximum value 999! Please enter a new value.)");
                resetCatch();
            }
        },

        onOkClicked: function() {
            var op = this.model.get('operation');
            alert(op.visit + " inspection of " + op.condition + " trap with " + op.catch + " moths.");
            Controller.router.navigate('home', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        },

        setDefaultOperation: function(options) {
            //alert(option.value);
            var op = this.model.get('operation');
            op.catch = options.mothCount;
            op.condition = options.condition;
            op.visit = options.visit;
        }
    });

    return Inspection;
});
