define(['jquery',
    'underscore',
    'backbone',
    'src/util/CoordinateConverter',
    'src/util/NearestNeighbor',
    'src/models/CurrentPosition'
], function($, _, Backbone, CoordinateConverter, NearestNeighbor, CurrentPosition) { 'use strict';

    var my = {};

    my.watchId = null;
    my.gotSignal = false;
    my.Here = new CurrentPosition();
    my.SitesList = [];

    my.start = function () {
        this.currentPosition = new CurrentPosition();
        this.watchId = this.watchId || navigator.geolocation.watchPosition(_.bind(this.onPositionUpdate, this),
            function (error) {
                console.log(error.message);
            },
            {enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
        );
    };

    my.stop = function () {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    };

    my.onPositionUpdate = function (position) {
        this.gotSignal = true;

         var latLon = {
            Latitude: position.coords.latitude,
            Longitude: position.coords.longitude,
            Accuracy: Math.round(position.coords.accuracy)
        };

        var p = CoordinateConverter.datumShift({ Lon: latLon.Longitude, Lat: latLon.Latitude});
        this.Here.set('currentLatLon', latLon);
        this.Here.set('currentUtm', CoordinateConverter.project(p));

        this.findNearest();
    };

    my.findNearest = function() {
        var nearest = NearestNeighbor.Nearest(this.Here.get('currentUtm'), this.SitesList);
        this.Here.set('site', nearest[0].site);
        this.Here.set('relativePosition', nearest[0].relativePosition);
    };

    return my;
});