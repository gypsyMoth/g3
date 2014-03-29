define(['jquery',
    'underscore',
    'backbone',
    'src/util/Geolocation',
    'src/util/NearestNeighbor',
    'src/util/DB',
    'src/models/FileSystem',
    'src/models/Splash',
    'src/collections/Transactions',
    'src/collections/SitesFileCollection',
    'src/views/Splash',
    'src/views/Home',
    'src/views/Extras',
    'src/views/Placement',
    'src/views/Omit',
    'src/views/Caution',
    'src/views/Confirm',
	'src/views/History',
    'src/views/LoadSites',
    'src/views/ManualLock'
], function($, _, Backbone,
            Geolocation,
            NearestNeighbor,
            DB,
            Filesystem,
            Splash,
            Transactions,
            SitesFileCollection,
            SplashView,
            HomeView,
            ExtrasView,
            PlacementView,
            OmitView,
            CautionView,
            ConfirmView,
            HistoryView,
            LoadSitesView,
            ManualLockView) { 'use strict';

    var Router = Backbone.Router.extend({
        routes : {
            "splash" : "splash",
            "home" : "home",
            "extras" : "extras",
            "placement" : "placement",
            "omit" : "omit",
            "caution" : "caution",
            "confirm" : "confirm",
			"history" : "history",
            "loadSites" : "loadSites",
            "manualLock" : "manualLock"
        },

        splash: function() {
            this.loadView(new SplashView({model: new Splash()}));
        },

        home : function() {
            this.loadView(new HomeView({model: Geolocation.Here, template: _.template($('#home-template').html())}));
        },

        extras: function() {
            this.loadView(new ExtrasView({model: new Filesystem()}));
        },

        placement : function() {
            this.loadView(new PlacementView({model: Geolocation.Here}));
        },

        omit: function() {
            this.loadView(new OmitView({model: Geolocation.Here}));
        },

        caution: function() {
            this.loadView(new CautionView({model: Geolocation.Here}));
        },

        confirm: function() {
            this.loadView(new ConfirmView({model: Geolocation.Here}));
        },
		
		history: function() {
            DB.getTransactions().then(_.bind(function(transactions) {
                this.loadView(new HistoryView({collection: transactions}));
            }, this));
        },

        loadSites: function() {
            DB.getSitesFiles().then(_.bind(function(sitesFiles) {
                this.loadView(new LoadSitesView({collection: sitesFiles}));
            }, this));
        },

        manualLock: function() {
            this.loadView(new ManualLockView({model: Geolocation.Here}));
        },

        loadView : function(view) {
            this.view && this.view.remove();
            this.view = view;
            $("#content").append(this.view.render().el);
        }
    });

    return Router;
});