define(['jquery',
    'underscore',
    'backbone',
    'knockout',
    'src/Router',
    'src/viewmodels/Gadget',
    'src/util/Geolocation',
    'src/util/DB',
    'src/util/Controller',
    'src/models/Splash',
    'src/views/Splash'
    ], function($, _, Backbone, ko, Router, GadgetView, Geolocation, DB, Controller, Splash, SplashView) { 'use strict';

     var my = {};
    //_.extend(my, Backbone.Events);

    my.isInitialized = false;

    my.initialize = function () {
        document.addEventListener('deviceready', _.bind(this.onDeviceReady, this), false);
    };

    my.onDeviceReady = function () {
        Controller.gadget = new GadgetView();
        ko.applyBindings(Controller.gadget);
        Controller.gadget.initialize();
    };

    /*var exitApplication = function(message) {
        alert(message);
        if (navigator.app) {
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        }
    };*/

    my.fail = function (error) {
        console.log('G3 error: ' + error.message);
    };

    return my;
});