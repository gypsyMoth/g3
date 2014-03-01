define(['jquery',
    'underscore',
    'backbone',
    'src/Router',
    'src/util/Geolocation',
    'src/util/DB',
    'src/util/Controller',
    'src/models/Splash',
    'src/views/Splash'
    ], function($, _, Backbone, Router, Geolocation, DB, Controller, Splash, SplashView) { 'use strict';

     var my = {};
    _.extend(my, Backbone.Events);

    my.isInitialized = false;

    my.initialize = function () {
        document.addEventListener('deviceready', _.bind(this.onDeviceReady, this), false);
    };

    my.onDeviceReady = function () {
        Controller.router = new Router();
        Backbone.history.start();

        if (this.isInitialized) {
            Controller.router.navigate('home', {trigger: true, replace: true});
        } else {
            this.showSplash();
        }
    };

    my.showSplash = function () {
        this.Startup = new Splash();
        Controller.router.loadView(new SplashView({model: this.Startup, template: _.template($('#splash-template').html())}));
        this.Startup.set('message', 'Initializing filesystem...');
        DB.initialize().then(_.bind(this.loadSites, this));
    };

    my.loadSites = function() {
        this.Startup.set('message', 'Loading sites from file...');
        DB.loadSites('TX', 1).then(_.bind(function(data) {
            Geolocation.SitesList = data;
            _.bind(this.initializeGps, this)();
        }, this));
    };

    my.initializeGps = function() {
        this.Startup.set('message', 'Acquiring Satellites');
        this.listenTo(Geolocation.Here, 'change', this.gotGpsSignal);
        Geolocation.start();
    };

     my.gotGpsSignal = function() {
         Controller.router.navigate('home', {trigger: true, replace: true});
     };

    my.fail = function (error) {
        console.log('G3 error: ' + error.message);
    };

    return my;
});