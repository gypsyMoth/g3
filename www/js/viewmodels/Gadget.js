define(['jquery',
    'underscore',
    'knockout',
    'src/viewmodels/Splash',
    'src/viewmodels/Home'
], function($,
            _,
            ko,
            SplashView,
            HomeView) {

    'use strict';

    var Gadget = function () {

        this.currentView = ko.observable('splash');

        this.initialize = function(){
            this.splash = new SplashView();
            this.home = new HomeView();
            this.splash.initializeGadget();
        };

        this.changeView = function(name){
            this.currentView(name);
        };

        this.signal = ko.observable(false);

    };

    return Gadget;
});
