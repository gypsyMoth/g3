define(['jquery',
    'underscore',
    'knockout',
    'src/util/DB',
    'src/util/Geolocation',
    'src/viewmodels/Gadget'
], function($,
            _,
            ko,
            DB,
            Geolocation,
            Gadget
    ) {

    'use strict';

    var SplashView = function() {

        this.message = ko.observable('Initializing File System...');

        this.initializeGadget = function() {
            DB.initialize().then(_.bind(this.initSites, this));
        };

        this.initSites = function(){
            this.message('Loading Sites From File...');
            DB.getSitesFiles().then(_.bind(function(sitesFiles) {
                if (sitesFiles.length > 0) {
                    _.bind(loadSites, this, (sitesFiles.first().get('fileEntry')))();
                } else {
                    exitApplication("No sites files found; please load at least one set of sites.");
                }
            }, this));
        };

        var loadSites = function(sitesFile) {
            DB.loadSites(sitesFile).then(_.bind(function (data) {
                Geolocation.SitesList = data;
                _.bind(this.initializeGps, this)();
            }, this));
        };

        var exitApplication = function(message) {
            alert(message);
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        };

        this.initializeGps = function() {
            alert("Initializing!");
            this.message('Acquiring Satellites...');
            Gadget.changeView('home');
            /*Geolocation.start();
            this.listenTo(Geolocation.currentLatLon, 'change', this.gotGpsSignal);
            if (Geolocation.gotSignal) {
                this.gotGpsSignal();
            }*/
        };

        this.gotGpsSignal = function() {
            this.stopListening(Geolocation.currentLatLon);
            Gadget.changeView('home');
            //Controller.router.navigate('home', {trigger: true, replace: true});
        };

        this.fail = function (error) {
            console.log('G3 error: ' + error.message);
        };
    };

    return SplashView;

});
