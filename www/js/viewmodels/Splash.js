define(['jquery',
    'underscore',
    'knockout',
    'src/util/DB',
    'src/util/Geolocation',
    'src/util/Controller'
], function($,
            _,
            ko,
            DB,
            Geolocation,
            Controller
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
                Controller.gadget.sitesFiles(sitesFiles);
                if (sitesFiles.length === 1) {
                    _.bind(loadSites, this, (sitesFiles[0].fileEntry))(); //.first().get('fileEntry')))();
                } else if (sitesFiles.length > 1) {
                    Controller.gadget.changeView('loadSites');
                } else if (sitesFiles.length === 0) {
                    if (DB.checkConnection()) {
                            Controller.gadget.changeView('download');
                    } else {
                        Controller.gadget.exitApplication(Controller.errors.sites);
                    }
                } else {
                    Controller.gadget.exitApplication("Error loading sites files!");
                }
            }, this));
        };

        var loadSites = function(sitesFile) {
            DB.loadSites(sitesFile).then(_.bind(function (data) {
                Geolocation.SitesList = data;
                Controller.gadget.sitesList(data);
                _.bind(this.initializeGps, this)();
            }, this));
        };

        /*var exitApplication = function(message) {
            alert(message);
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        };*/

        this.initializeGps = function() {
            this.message('Acquiring Satellites...');
            Geolocation.start();
            Controller.gadget.changeView('home');
            //this.listenTo(Geolocation.currentLatLon, 'change', this.gotGpsSignal);
            //if (Controller.viewModel.signal() === true) {
            //    this.gotGpsSignal();
            //}
        };

        this.gotGpsSignal = function() {
            alert("GOING HOME!");
            //this.stopListening(Geolocation.currentLatLon);
            Controller.gadget.changeView('home');
            //Controller.router.navigate('home', {trigger: true, replace: true});
        };

        this.fail = function (error) {
            console.log('G3 error: ' + error.message);
        };
    };

    return SplashView;

});
