define(['jquery',
    'underscore',
    'knockout',
    'src/viewmodels/Gadget',
    'src/util/Geolocation',
    'src/util/DB',
    'src/util/Controller'
    ], function($, _, ko, GadgetView, Geolocation, DB, Controller) { 'use strict';

    var my = {};

    my.isInitialized = false;

    my.initialize = function () {
        document.addEventListener('deviceready', _.bind(this.onDeviceReady, this), false);
    };

    my.onDeviceReady = function () {
        var mql = window.matchMedia("(orientation: portrait)");
        if (mql.matches) {
            window.plugins.orientationLock.lock("landscape");
            window.plugins.orientationLock.lock("portrait");
        } else {
            window.plugins.orientationLock.lock("portrait");
            window.plugins.orientationLock.lock("landscape");
        }
        window.plugins.orientationLock.unlock();
        Controller.gadget = new GadgetView();
        ko.applyBindings(Controller.gadget);
        Controller.gadget.initialize();
    };

    my.fail = function (error) {
        console.log('G3 error: ' + error.message);
    };

    return my;
});