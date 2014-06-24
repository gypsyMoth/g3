define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/inspection.html',
    'src/util/Controller',
    'src/util/Date'
], function($, _, Backbone, inspectionTemplate, Controller, DateFormatter) {
    'use strict';

    var Inspection = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = _.template(inspectionTemplate);
            this.setDefaultOperation({condition: 'GOOD', visit: 'MIDSEASON', mothCount: 0});
        },

        events: {
            "click #btnInspectionOk": "onOkClicked",
            "click #btnInspectionCancel": "onCancelClicked",
            "change #selectInspectionType": "onTypeChanged",
            "change #selectCondition": "onConditionChanged",
            "change #mothCount": "onMothCountChanged"
        },

        resetCatch: function() {
            var op = this.model.get("operation");
            op.catch = 0;
            $("#mothCount").val(null);
        },

        allowMothCount: function(insType) {
            var countDiv = this.$el.find('#enterCount');
            if (insType === 'GOOD' || insType === 'DAMAGED'){
                countDiv.css('visibility', 'visible');
            } else {
                countDiv.css('visibility', 'hidden');
                this.resetCatch();
            }
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
            this.model.get('operation').catch = parseInt(e.target.value, 10);
        },

        onOkClicked: function() {
            var op = this.model.get('operation');
            if (op.catch >= 0 && op.catch <=999) {
                Controller.router.navigate('confirm', {trigger: true, replace: true});
            } else {
                alert("Invalid moth count! Maximum value 999! Please enter a new value.)");
                this.resetCatch();
            }
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        },

        setDefaultOperation: function(options) {
            var op = this.model.get('operation');
            var utm = this.model.get('currentUtm');
            var site = this.model.get('selectedSite').get('site');
            var accuracy = this.model.get('accuracy');
            op.zone = utm.Zone;
            op.easting = utm.Easting;
            op.northing = utm.Northing;
            op.accuracy = accuracy;
            op.traptype = site.trap_type;
            op.date = DateFormatter.getSitesFormatDate(Date.now());
            op.visit = options.visit;
            op.condition = options.condition;
            op.catch = options.mothCount;
        }
    });

    return Inspection;
});
