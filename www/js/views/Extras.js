define(['underscore', 
    'backbone',
    'src/util/Date',
    'src/util/DB',
    'src/util/Geolocation',
    'src/util/Controller',
    'text!src/templates/extras.html'
], function(_, Backbone, DateFormatter, DB, Geolocation, Controller, extrasTemplate) { 'use strict';

    var Extras = Backbone.View.extend({

        tagName: "div",

        className: "view",

        hasFiles: false,

        initialize: function(options) {
            this.template = _.template(extrasTemplate);
        },

        events: {
            "click #btnExtrasHistory": "onHistoryClicked",
            "click #btnExtrasManualLock": "onManualLockClicked",
			"click #btnExtrasLoadSites": "onLoadSitesClicked",
            "click #btnExtrasRandom" : "onRandomClicked",
            "click #btnExtrasCancel": "onCancelClicked",
            "click #btnExtrasQC": "onQCInspectionClicked"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onQCInspectionClicked: function() {
            var site = this.model.get('selectedSite').get('site');
            var txn_date = site.txn_date;
            var qcStatus = site.passFail;
            var dist = this.model.get('selectedSite').get('relativePosition').get('distance');
            if (site.xact === undefined || site.trap_type === 'Omit'){
                alert("Cannot QC inspect trap that is not yet placed or previously omitted!");
            } else {
                if (txn_date === DateFormatter.getSitesFormatDate(Date.now()) && qcStatus != undefined) {
                    alert("Trap cannot be QC inspected twice on the same day!");
                    Geolocation.start();
                } else {
                    if (dist > 100) {
                        alert("Inspections cannot be completed from more than 100 meters away. This may be due to GPS error now or during placement.");
                        Geolocation.start();
                    } else {
                        Controller.router.navigate('qcInspection', {trigger: true, replace: true});
                    }
                }
            }
        },

		onHistoryClicked: function() {
            Controller.router.navigate('history', {trigger: true, replace: true});
        },

        onManualLockClicked: function() {
            Controller.router.navigate('manualLock', {trigger: true, replace: true});
        },

        onLoadSitesClicked: function() {
            Controller.router.navigate('loadSites', {trigger: true, replace: true});
        },

        onRandomClicked: function() {
            Controller.router.navigate('random', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        }
    });

    return Extras;
});