define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/qcInspection.html',
    'src/util/Controller',
    'src/util/Date'
], function($, _, Backbone, qcInspectionTemplate, Controller, DateFormatter) {
    'use strict';

    var QCInspection = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = _.template(qcInspectionTemplate);
            this.setDefaultOperation({condition: 'GOOD', visit: 'MIDSEASON', passFail:'Passed', failReason:undefined});
        },

        events: {
            "click #btnQCOk": "onOkClicked",
            "click #btnQCCancel": "onCancelClicked",
            "change #selectQCInspectionType": "onTypeChanged",
            "change #selectQCCondition": "onConditionChanged",
            "change #selectQCPassFail": "onQCPassFailChanged",
            "change #selectQCFailReason": "onQCFailReasonChanged"
        },

        allowFailReason: function(grade) {
            var reason = this.$el.find('#failReason');
            var op = this.model.get('operation');
            if (grade === "Failed"){
                reason.css('visibility', 'visible');
                op.failReason = $("#selectQCFailReason").val();
            } else {
                reason.css('visibility', 'hidden');
                op.failReason = undefined;
            }
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onQCTypeChanged: function(e) {
            var selectedOption = e.target.options[e.target.selectedIndex];
            this.model.get('operation').visit = selectedOption.value;
        },

        onQCConditionChanged: function(e) {
            var selectedOption = e.target.options[e.target.selectedIndex];
            this.model.get('operation').condition = selectedOption.value;
        },

        onQCPassFailChanged: function(e) {
            var selectedOption = e.target.options[e.target.selectedIndex];
            this.model.get('operation').passFail = selectedOption.value;
            this.allowFailReason(selectedOption.value);
        },

        onQCFailReasonChanged: function(e) {
            var selectedOption = e.target.options[e.target.selectedIndex];
            this.model.get('operation').failReason = selectedOption.value;
        },

        onOkClicked: function() {
            var op = this.model.get('operation');
            //alert(op.passFail + " " + op.visit + " QC  inspection of " + op.condition + " trap. If it failed, it was because " + op.failReason + ".");
            Controller.router.navigate('confirm', {trigger: true, replace: true});
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
            op.passFail = options.passFail;
            op.condition = options.condition;
            op.visit = options.visit;
            op.failReason = options.failReason;
        }
    });

    return QCInspection;
});
