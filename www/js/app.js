var app = {
    views: {},
    models: {},
    router: {},
    Root: "",
    SitesList: [],
    Here: {},
    startGeolocation: function() {},
    onDeviceReady: function() {}
};

$(document).on("ready", function () {
    'use strict';

    app.pageRouter = new app.Router();
    Backbone.history.start();

    app.Root = "";

    app.SitesList = [
        {"zone":15,"xth":"329229","yth":"3475979","quad":"FIREP","site_id":1,"grid":"30","trap_type":"Milk Carton","moth_count":0},
        {"zone":15,"xth":"329180","yth":"3475941","quad":"DITCH","site_id":2,"grid":"30","trap_type":"Milk Carton","moth_count":0},
        {"zone":15,"xth":"528000","yth":"4176000","quad":"TEST","site_id":3,"grid":"8000","trap_type":"Milk Carton","moth_count":0}
    ];

    app.startGeolocation = function() {
        app.watchId = navigator.geolocation.watchPosition(app.onPositionUpdate,
            function(error) {
                console.log(error.message);
            },
            {enableHighAccuracy:true, timeout:1000, maximumAge:0 }
        );
    };

    app.onPositionUpdate = function (position) {
        var p = CoordinateConverter.datumShift({ Lon:position.coords.longitude, Lat:position.coords.latitude});
        var utm = CoordinateConverter.project(p);
        app.Here.set({currentUtm: utm});
        app.Here.set({nearestSite: Sites.Nearest(utm, app.SitesList)});
    },

    app.stopGeolocation = function() {
        if (app.watchId !== null) {
            navigator.geolocation.clearWatch(app.watchId);
            app.watchId = null;
        }
    },

    app.onDeviceReady = function() {
        app.Here = new app.models.CurrentPosition();
        app.pageRouter.navigate('home', true);
    };

    document.addEventListener('deviceready', app.onDeviceReady, false);
});