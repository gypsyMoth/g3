define(['jquery',
    'underscore',
    'knockout',
    'src/util/Geolocation',
    'src/viewmodels/Position',
    'src/models/Site',
    'src/viewmodels/Splash',
    'src/viewmodels/Home'
], function($,
            _,
            ko,
            Geolocation,
            Position,
            Site,
            SplashView,
            HomeView) {

    'use strict';

    var Gadget = function () {

        this.manualLock = ko.observable(false);

        this.currentView = ko.observable('splash');

        this.selectedSite = ko.observable(new Site());

        this.position = ko.observable(new Position());

        this.operationalSite = ko.observable(new Site());

        this.sitesList = ko.observableArray();

        this.nearestSites = ko.observableArray();

        this.initialize = function(){
            this.home = new HomeView();
            this.splash = new SplashView();
            this.splash.initializeGadget();
        };

        this.changeView = function(name){
            switch(name){
                case('home'):
                    Geolocation.start();
                    break;
                case('extras'):
                    Geolocation.stop();
                    //alert(JSON.stringify(this.position().utm()));
                    //alert(JSON.stringify(this.selectedSite()));
                    //alert(JSON.stringify(this.nearestSites()));
                    break;
            }
            this.currentView(name);
        };
    };

    return Gadget;
});
