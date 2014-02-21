define (function(require) {

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
            var p = this.CoordinateConverter.datumShift({ Lon:position.coords.longitude, Lat:position.coords.latitude});
            var utm = this.CoordinateConverter.project(p);
            var latLon = {
                Latitude: position.coords.latitude,
                Longitude: position.coords.longitude,
                Accuracy: Math.round(position.coords.accuracy)
            };
            var nearest = this.NearestNeighbor.Nearest(utm, this.SitesList);
            this.Here.set({currentLatLon: latLon, currentUtm: utm, relativePosition: nearest.relativePosition, site: nearest.site});
        },

        onDeviceReady: function() {
            this.pageRouter = new this.Router();
            Backbone.history.start();

            if (this.isInitialized) {
                this.pageRouter.navigate('home', true);
            } else {
                this.Startup = new this.models.Splash();
                this.Here = new this.models.CurrentPosition();
                this.pageRouter.navigate('splash', true);
            }
        },

        fail: function(error) {
            console.log('G3 error: ' + error.message);
        },

        rpad: function (string, width, padding) {
            return (width <= string.length) ? string : this.rpad(string + padding, width, padding)
        },

        lpad: function (string, width, padding) {
            return (width <= string.length) ? string : this.lpad(padding + string, width, padding)
        }
    };

    return app;
});