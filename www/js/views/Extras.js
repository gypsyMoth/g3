define(['underscore', 
    'backbone', 
    'src/util/DB',
    'src/util/Geolocation',
    'src/util/Controller',
    'src/util/Transactions'
], function(_, Backbone, DB, Geolocation, Controller, Transactions) { 'use strict';

    var Extras = Backbone.View.extend({

        tagName: "div",

        className: "view",

        hasFiles: false,

        initialize: function(options) {
            this.template = options.template;
        },

        events: {
            "click #btnExtrasHistory": "onHistoryClicked",
            "click #btnExtrasManualLock": "onManualLockClicked",
			"click #btnExtrasLoadSites": "onLoadSitesClicked",
            "click #btnExtrasCancel": "onCancelClicked"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
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

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        }
    });

    return Extras;
});