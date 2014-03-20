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
            "caution" : "caution",
            "confirm" : "confirm",
			"history" : "history",
            "loadSites" : "loadSites",
            "manualLock" : "manualLock"
        },

        splash: function() {
            this.loadView(new SplashView({model: new Splash(), template: _.template($('#splash-template').html())}));
        },

        home : function() {
            this.loadView(new HomeView({model: Geolocation.Here, template: _.template($('#home-template').html())}));
        },

        extras: function() {
            this.loadView(new ExtrasView({model: new Filesystem(), template: _.template($('#extras-template').html())}));
        },

        placement : function() {
            this.loadView(new PlacementView({model: Geolocation.Here, template: _.template($('#placement-template').html())}));
        },

        caution: function() {
            this.loadView(new CautionView({model: Geolocation.Here, template: _.template($('#caution-template').html())}));
        },

        confirm: function() {
            this.loadView(new ConfirmView({model: Geolocation.Here, template: _.template($('#confirm-template').html())}));
        },
		
		history: function() {
            DB.getTransactions().then(_.bind(function(transactions) {
                this.loadView(new HistoryView({collection: transactions, template: _.template($('#history-template').html())}));
            }, this));
        },

        loadSites: function() {
            DB.getSitesFiles().then(_.bind(function(sitesFiles) {
                this.loadView(new LoadSitesView({collection: sitesFiles, template: _.template($('#loadSites-template').html())}));
            }, this));
        },

        manualLock: function() {
            this.loadView(new ManualLockView({model: Geolocation.Here, /*collection: Geolocation.Here.get('nearestSites'),*/ template: _.template($('#manualLock-template').html())}));
        },

        loadView : function(view) {
            this.view && this.view.remove();
            this.view = view;
            $("#content").append(this.view.render().el);
        }
    });

    return Router;
});