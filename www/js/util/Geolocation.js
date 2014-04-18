define(['jquery',
    'underscore',
    'backbone',
    'src/util/CoordinateConverter',
    'src/util/NearestNeighbor',
    'src/models/NearestSite',
    'src/models/LatLon',
    'src/models/CurrentPosition'
], function($, _, Backbone, CoordinateConverter, NearestNeighbor, NearestSite, LatLon, CurrentPosition) { 'use strict';

    var my = {};

    my.watchId = null;
    my.gotSignal = false;
    my.Here = new CurrentPosition();
    my.currentLatLon = new LatLon();
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
        this.currentLatLon.set({
            Latitude: position.coords.latitude,
            Longitude: position.coords.longitude,
            Accuracy: Math.round(position.coords.accuracy)
        });
        this.updateModel();
    };

    my.updateModel = function () {
        var p = CoordinateConverter.datumShift({ Lon: this.currentLatLon.get('Longitude'), Lat: this.currentLatLon.get('Latitude')});
        this.Here.set('currentUtm', CoordinateConverter.project(p));
        this.Here.set('accuracy', this.currentLatLon.get('Accuracy'));
        this.findNearest();
    };

    my.findNearest = function() {
        this.Here.nearestSites = NearestNeighbor.getNearestSites(this.Here.get('currentUtm'), this.SitesList, 5);
        var newSite;
        //var selectedSite = $.extend(true, {}, this.Here.get('selectedSite')); //to make eventing work with a nested object
        var selectedSite = this.Here.get('selectedSite');
        if (this.Here.get('manualLock')) {
            newSite = this.updateSelectedSite(selectedSite.get('site'));
        } else {
            newSite = this.Here.nearestSites.first();
        }
        this.Here.set('selectedSite', newSite);
    };

    my.updateSelectedSite = function(site) {
        return NearestNeighbor.getSelectedSite(this.Here.get('currentUtm'), site);
    };

    my.getSiteById = function(quad, site_id) {
        return _.find(this.SitesList, function(site) {
            return (site.quad === quad && site.site_id === site_id);
        });
    };

    my.getNextRandomSiteId = function() {
        var maxId = _.reduce(_.pluck(this.SitesList, 'site_id'), function(currentId, nextId) {
            return currentId > nextId ? currentId : nextId;
        }, 8999);

        if (maxId >= 9999) {
            throw new RangeError("Too many randoms--random ids must be between 9000 and 9999");
        }

        return maxId + 1;
    };

    my.addRandomSite = function(randomSite) {
        this.SitesList.push(randomSite);
    };

    return my;
});