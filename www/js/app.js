define (['jquery',
    'underscore',
    'backbone',
    'src/Router',
    'src/util/CoordinateConverter',
    'src/util/NearestNeighbor',
    'src/models/CurrentPosition',
    'src/models/Splash'
    ], function($, _, Backbone, Router, CoordinateConverter, NearestNeighbor, CurrentPosition, SplashModel) {

    var app = {
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

        initialize: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },

        startGeolocation: function() {
            this.watchId = this.watchId || navigator.geolocation.watchPosition(this.onPositionUpdate,
                function(error) {
                    console.log(error.message);
                },
                {enableHighAccuracy:true, timeout:3000, maximumAge:0 }
            );
        },

        stopGeolocation: function() {
            if (this.watchId !== null) {
                navigator.geolocation.clearWatch(this.watchId);
                this.watchId = null;
            }
        },

        onPositionUpdate: function (position) {
            this.Startup.set('gotSignal', true); //Tell the splash screen we're good now
            var p = CoordinateConverter.datumShift({ Lon:position.coords.longitude, Lat:position.coords.latitude});
            var utm = CoordinateConverter.project(p);
            var latLon = {
                Latitude: position.coords.latitude,
                Longitude: position.coords.longitude,
                Accuracy: Math.round(position.coords.accuracy)
            };
            var nearest = NearestNeighbor.Nearest(utm, this.SitesList);
            this.Here.set({currentLatLon: latLon, currentUtm: utm, relativePosition: nearest.relativePosition, site: nearest.site});
        },

        onDeviceReady: function() {
            this.pageRouter = new Router();
            Backbone.history.start();

            if (this.isInitialized) {
                this.pageRouter.navigate('home', true);
            } else {
                this.startup();
                this.Here = new CurrentPosition();
                this.pageRouter.navigate('splash', true);
            }
        },

        startup: function() {
            this.Startup = new SplashModel();
            this.Startup.set('message', 'Initializing filesystem...');

            DB.initialize().then( function() {
                this.Startup.set('message', 'Loading sites from file...');
                this.SitesList = DB.loadSites('TX', 1).then( function() {
                    this.Startup.set('message', 'Acquiring Satellites');
                    this.startGeolocation();
                });
            });
        },

        fail: function(error) {
            console.log('G3 error: ' + error.message);
        }
    };

    return app;
});