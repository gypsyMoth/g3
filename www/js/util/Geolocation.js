define(['jquery',
    'underscore',
    'backbone',
    'src/util/CoordinateConverter',
    'src/util/NearestNeighbor',
    'src/models/NearestSite',
    'src/models/LatLon',
    'src/models/CurrentPosition',
    'src/viewmodels/Position',
    'src/viewmodels/Site',
    'src/util/Controller'
], function($, _, Backbone, CoordinateConverter, NearestNeighbor, NearestSite, LatLon, CurrentPosition, Position, Site, Controller) { 'use strict';

    var my = {};

    var Gadget;

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
        Gadget = Controller.gadget;
        if (Gadget.currentView() === 'splash'){
            Gadget.changeView('home');
        }
        //var positionModel = Controller.gadget.position();
        Gadget.position().latitude(position.coords.latitude);
        Gadget.position().longitude(position.coords.longitude);
        Gadget.position().accuracy(Math.round(position.coords.accuracy));
        this.currentLatLon.set({
            Latitude: position.coords.latitude,
            Longitude: position.coords.longitude,
            Accuracy: Math.round(position.coords.accuracy)
        });
        //this.updateModel();
        if (!Gadget.manualLock()){
            this.findNearest(Gadget.position().utm());
        }
    };

    my.updateModel = function () {
        var p = CoordinateConverter.datumShift({ Lon: this.currentLatLon.get('Longitude'), Lat: this.currentLatLon.get('Latitude')});
        this.Here.set('currentUtm', CoordinateConverter.project(p));
        this.Here.set('accuracy', this.currentLatLon.get('Accuracy'));
        this.findNearest();
    };

    my.findNearest = function(pos) {
        Gadget = Controller.gadget;
        Gadget.nearestSites(NearestNeighbor.getNearestSites(pos, Gadget.sitesList(), 5));
        //this.Here.nearestSites = NearestNeighbor.getNearestSites(pos, Gadget.sitesList(), 5);
        var newSite;
        //var selectedSite = $.extend(true, {}, this.Here.get('selectedSite')); //to make eventing work with a nested object
        //var selectedSite = this.Here.get('selectedSite');
        if (Gadget.manualLock()) {
            newSite = Gadget.selectedSite(); //this.updateSelectedSite(selectedSite.get('site'));
        } else {
            newSite = Gadget.nearestSites()[0] //this.Here.nearestSites.first();
        }

        //this.Here.set('selectedSite', newSite);
        Controller.gadget.selectedSite(Gadget.nearestSites()[0]);
    };

    my.updateSelectedSite = function(site) {
        return NearestNeighbor.getSelectedSite(this.Here.get('currentUtm'), site);
    };

    my.getSiteById = function(quad, site_id) {
        return _.find(Controller.gadget.sitesList(), function(site) {
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