define(['jquery',
    'underscore',
    'backbone',
    'src/util/CoordinateConverter',
    'src/util/NearestNeighbor',
    'src/viewmodels/Position',
    'src/models/Site',
    'src/util/Controller'
], function($, _, Backbone, CoordinateConverter, NearestNeighbor, Position, Site, Controller) { 'use strict';

    var my = {};

    var Gadget;

    my.watchId = null;
    my.SitesList = [];

    my.start = function () {
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
        Gadget = Controller.gadget;
        if (Gadget.currentView() === 'splash'){
            Gadget.changeView('home');
        }
        Gadget.position().latitude(position.coords.latitude);
        Gadget.position().longitude(position.coords.longitude);
        Gadget.position().accuracy(Math.round(position.coords.accuracy));
        Gadget.position().timestamp(position.timestamp);
        if (!Gadget.manualLock()){
            this.findNearest(Gadget.position().utm());
        }
    };

    my.findNearest = function(pos) {
        Gadget = Controller.gadget;
        Gadget.nearestSites(NearestNeighbor.getNearestSites(pos, Gadget.sitesList(), 5));
        Controller.gadget.selectedSite(Gadget.nearestSites()[0]);
    };

    my.getSiteById = function(quad, site_id) {
        return _.find(Controller.gadget.sitesList(), function(site) {
            return (site.quad === quad && site.site_id === site_id);
        });
    };

    my.getNextRandomSiteId = function() {
        var maxId = _.reduce(_.pluck(Controller.gadget.sitesList(), 'site_id'), function(currentId, nextId) {
            return currentId > nextId ? currentId : nextId;
        }, 8999);
        if (maxId >= 9999) {
            throw new RangeError("Too many randoms--random ids must be between 9000 and 9999");
        }

        return maxId + 1;
    };

    my.addRandomSite = function(randomSite) {
        Controller.gadget.sitesList().push(randomSite);
    };

    return my;
});