define(['jquery',
    'underscore',
    'backbone',
    'src/util/CoordinateConverter',
    'src/util/NearestNeighbor',
    'src/models/CurrentPosition'
], function($, _, Backbone, CoordinateConverter, NearestNeighbor, CurrentPosition) { 'use strict';

    return {

        watchId: null,

        currentPosition: null,

        start: function () {
            this.currentPosition = new CurrentPosition();
            this.watchId = this.watchId || navigator.geolocation.watchPosition(this.onPositionUpdate,
                function (error) {
                    console.log(error.message);
                },
                {enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
            );
        },

        stop: function () {
            if (this.watchId !== null) {
                navigator.geolocation.clearWatch(this.watchId);
                this.watchId = null;
            }
        },

        onPositionUpdate: function (position) {
            this.Startup.set('gotSignal', true); //Tell the splash screen we're good now
            var p = CoordinateConverter.datumShift({ Lon: position.coords.longitude, Lat: position.coords.latitude});
            var utm = CoordinateConverter.project(p);
            var latLon = {
                Latitude: position.coords.latitude,
                Longitude: position.coords.longitude,
                Accuracy: Math.round(position.coords.accuracy)
            };
            var nearest = NearestNeighbor.Nearest(utm, this.SitesList);
            this.Here.set({currentLatLon: latLon, currentUtm: utm, relativePosition: nearest.relativePosition, site: nearest.site});
        }
    };
});