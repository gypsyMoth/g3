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

        this.splash = new SplashView();

        this.home = new HomeView();

        this.initialize = function(){
            this.splash.initializeGadget();
        };

        this.changeView = function(name){
            alert('GOING HOME!');
            this.currentView(name);
        };





    };

    return Gadget;
});
