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
            this.setDefaultOperation({condition: 'GOOD', failReason:'Passed'});
        },

        events: {
            "click #btnQCOk": "onOkClicked",
            "click #btnQCCancel": "onCancelClicked",
            "change #selectQCCondition": "onQCConditionChanged",
            "change #selectQCFailReason": "onQCFailReasonChanged"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onQCConditionChanged: function(e) {
            var selectedOption = e.target.options[e.target.selectedIndex];
            this.model.get('operation').condition = selectedOption.value;
        },

        onQCFailReasonChanged: function(e) {
            var selectedOption = e.target.options[e.target.selectedIndex];
            this.model.get('operation').failReason = selectedOption.value;
        },

        onOkClicked: function() {
            var op = this.model.get('operation');
            op.visit = 'MIDSEASON';
            if (op.failReason === 'Passed') {
                op.passFail = 'Passed';
            } else {
                op.passFail = 'Failed';
            }
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
            op.condition = options.condition;
            op.failReason = options.failReason;
        }
    });

    return QCInspection;
});
