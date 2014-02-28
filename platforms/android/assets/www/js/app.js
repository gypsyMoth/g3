define(['jquery',
    'underscore',
    'backbone',
    'src/Router',
    'src/util/Geolocation',
    'src/util/DB',
    'src/models/Splash'
    ], function($, _, Backbone, Router, Geolocation, DB, Splash) {
    'use strict';

     var my = {};
    _.extend(my, Backbone.Events);


    //my.SitesList= [];
    //my.Here= {};
    my.isInitialized = false;

    my.operationTypes = {
        ERROR: 'ERROR',
        UNADDRESSED: 'UNADDRESSED',
        PLACED: 'PLACED',
        OMITTED: 'OMITTED',
        MIDSEASON: 'MIDSEASON',
        FINAL: 'FINAL'
    };

    my.initialize = function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    };

    my.onDeviceReady = function () {
        this.pageRouter = new Router();
        Backbone.history.start();

        if (this.isInitialized) {
            this.pageRouter.navigate('home', true);
        } else {
            this.showSplash();
            this.pageRouter.navigate('splash', true);
        }
    };

    my.showSplash = function () {
        this.Startup = new Splash();
        this.Startup.set('message', 'Initializing filesystem...');
        DB.initialize().then(_.bind(this.loadSites, this));
    };

    my.loadSites = function() {
        this.Startup.set('message', 'Loading sites from file...');
        Geolocation.SitesList = DB.loadSites('TX', 1).then(_.bind(this.initializeGps, this));
    };

    my.initializeGps = function() {
        this.Startup.set('message', 'Acquiring Satellites');
        this.listenTo(Geolocation.Here, 'change', this.gotGpsSignal);
        Geolocation.start();
    };

     my.gotGpsSignal = function() {
         console.log("got gps");
         this.pageRouter.navigate('home', {trigger: true, replace: true});
     };

    my.fail = function (error) {
        console.log('G3 error: ' + error.message);
    };

    return my;
});