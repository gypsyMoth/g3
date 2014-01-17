app = app || {}

$(function () {
    'use strict';

    app.Root = "";

    app.SitesList = [
        {"zone":15,"xth":"536000","yth":"4184000","quad":"TEST","site_id":1,"grid":"8000","trap_type":"Milk Carton","moth_count":0},
        {"zone":15,"xth":"528000","yth":"4168000","quad":"TEST","site_id":2,"grid":"8000","trap_type":"Milk Carton","moth_count":0},
        {"zone":15,"xth":"528000","yth":"4176000","quad":"TEST","site_id":3,"grid":"8000","trap_type":"Milk Carton","moth_count":0}
    ];

    app.Here = new app.CurrentPosition();
    app.Home = new app.HomeView({model: app.Here});

    app.startGeolocation = function() {
        var watchId = navigator.geolocation.watchPosition(function (position) {
                var p = CoordinateConverter.datumShift({ Lon:position.coords.longitude, Lat:position.coords.latitude});
                var utm = CoordinateConverter.project(p);
                app.Here.set({currentUtm: utm});
                app.Here.set({nearestSite: Sites.Nearest(utm, app.SitesList)});
            },
            function(error) {
                console.log(error.message);
            },
            {enableHighAccuracy:true, timeout:1000, maximumAge:0 }
        );
    };

    document.addEventListener('deviceready', app.startGeolocation, false);
});
