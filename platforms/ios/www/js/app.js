var app = {
    views: {},
    models: {},
    router: {},
    CoordinateConverter: {},
    NearestNeighbor: {},
    db: {},
    encoder: {},
    DateFormatter: {},
    SitesList: [],
    Here: {},
    isInitialized: false,

    operationTypes: {
        ERROR: 'ERROR',
        UNADDRESSED: 'UNADDRESSED',
        PLACED: 'PLACED',
        OMITTED: 'OMITTED',
        MIDSEASON: 'MIDSEASON',
        FINAL: 'FINAL'
    },

    start: function() {},
    onDeviceReady: function() {},

    rpad: function (string, width, padding) {
        return (width <= string.length) ? string : this.rpad(string + padding, width, padding)
    },

    lpad: function (string, width, padding) {
        return (width <= string.length) ? string : this.lpad(padding + string, width, padding)
    }
};

$(document).on("ready", function () {
    'use strict';

    app.pageRouter = new app.Router();
    Backbone.history.start();

    app.start = function() {
        app.watchId = app.watchId || navigator.geolocation.watchPosition(app.onPositionUpdate,
            function(error) {
                console.log(error.message);
            },
            {enableHighAccuracy:true, timeout:3000, maximumAge:0 }
        );
    };

    app.onPositionUpdate = function (position) {
        app.Startup.set('gotSignal', true); //Tell the splash screen we're good now
        var p = app.CoordinateConverter.datumShift({ Lon:position.coords.longitude, Lat:position.coords.latitude});
        var utm = app.CoordinateConverter.project(p);
        var latLon = {
            Latitude: position.coords.latitude,
            Longitude: position.coords.longitude,
            Accuracy: Math.round(position.coords.accuracy)
        };
        var nearest = app.NearestNeighbor.Nearest(utm, app.SitesList);
        app.Here.set({currentLatLon: latLon, currentUtm: utm, relativePosition: nearest.relativePosition, site: nearest.site});
    };

    app.stop = function() {
        if (app.watchId !== null) {
            navigator.geolocation.clearWatch(app.watchId);
            app.watchId = null;
        }
    };

    app.onDeviceReady = function() {
        console.log("G3 Device Ready!");

        if (app.isInitialized) {
            app.pageRouter.navigate('home', true);
        } else {
            app.Startup = new app.models.Splash();
            app.Here = new app.models.CurrentPosition();
            app.pageRouter.navigate('splash', true);
        }
    };

    app.fail = function(error) {
        console.log('G3 error: ' + error.message);
    };

    document.addEventListener('deviceready', app.onDeviceReady, false);
});