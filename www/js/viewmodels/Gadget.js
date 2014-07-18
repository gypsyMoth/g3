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

        this.currentView = ko.observable('splash');

        this.selectedSite = ko.observable(new Site());

        this.position = ko.observable(new Position());

        this.operationalSite = ko.observable(new Site());

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
                    break;
            }
            this.currentView(name);
        };
    };

    return Gadget;
});
