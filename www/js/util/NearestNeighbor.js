define (['jquery',
    'underscore',
    'src/util/Controller',
    'src/models/Site'],
    function ($, _, Controller, Site) { 'use strict';

    // Private methods
    var my = {};

    var getDistance = function(p2, p1) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };

    var getBearing = function(p2, p1) {
        var dX = p2.x - p1.x;
        var dY = p2.y - p1.y;
        var phi = Math.atan2(dY, dX); // This assumes 0 degrees is at (1,0)

        if (phi < 0) {
            phi += (2 * Math.PI);
        }  // Remap Atan2 from {-180, 180} to {0, 360}

        phi = phi * (180 / Math.PI); // Convert to degrees
        phi = (phi + 270) % 360; // Rotate back 90 degrees, to put north at (0,1)
        return phi;
    };

    var getBearingString = function(p2, p1) {
        var ret = "";
        var b = getBearing(p2, p1);

        if (b >= 337.5 || b < 22.5) {
            ret = "N";
        }
        else if (b >= 22.5 && b < 67.5) {
            ret = "NW";
        }
        else if (b > 67.5 && b < 112.5) {
            ret = "W";
        }
        else if (b > 112.5 && b < 157.5) {
            ret = "SW";
        }
        else if (b >= 157.5 && b < 202.5) {
            ret = "S";
        }
        else if (b > 202.5 && b < 247.5) {
            ret = "SE";
        }
        else if (b > 247.5 && b < 292.5) {
            ret = "E";
        }
        else if (b >= 292.5 && b < 337.5) {
            ret = "NE";
        }
        return ret;
    };

    // Public methods
    my.getNearestSites = function(currentLocation, sites, numberToReturn) {

        var currentPoint,
             point,
             distance,
             currentSite,
             i,
             nearestPoints,
             nearestSites;
        currentPoint = this.currentLocationToPoint(currentLocation);
        numberToReturn = this.checkNumberOfSites(numberToReturn, sites.length);
        nearestPoints = this.initializeNearestSites(numberToReturn);
        nearestSites = [];

        for (i = 0; i < sites.length; i++) {
            currentSite = sites[i];
            if (currentSite.zone === currentLocation.Zone) {
                point = this.getPoint(currentSite);
                distance = getDistance(point, currentPoint);
                nearestPoints.push({site: currentSite, dist: distance});
                this.sortByDistanceAscending(nearestPoints);
                nearestPoints.pop();
            }
        }

        for (i = 0; i < nearestPoints.length; i++){
            nearestSites.push(nearestPoints[i].site);
        }

        return nearestSites;
    };

    my.currentLocationToPoint = function(currentLocation) {
        return {x: currentLocation.Easting, y: currentLocation.Northing};
    };

    my.initializeNearestSites = function(numberOfPoints) {
        var nearestSites, i;
        nearestSites = []; //new NearestSiteCollection();
        for (i = 0; i < numberOfPoints; i++) {
            nearestSites.push({site: new Site(), dist: Number.MAX_VALUE});
        }
        return nearestSites;
    };

    my.checkNumberOfSites = function(numberOfPoints, totalNumberOfSites) {
        return numberOfPoints > totalNumberOfSites ? totalNumberOfSites : numberOfPoints;
    };

    my.getPoint = function(site) {
        return {x: site.xact || site.xth, y: site.yact || site.yth};
    };

    my.sortByDistanceDescending = function(nearestSites) {
        nearestSites.sort(function(site1, site2){
            return site1.dist === site2.dist ? 0 : (site1.dist > site2.dist ? -1 : 1);
        })
    };

    my.sortByDistanceAscending = function(nearestSites) {
        nearestSites.sort(function(site1, site2){
            return site1.dist === site2.dist ? 0 : (site1.dist < site2.dist ? -1 : 1)
        })
    };

    my.relative = function(site, current, previous){
        var point = this.getPoint(site);
        var currentPnt = this.currentLocationToPoint(current);
        var prevPnt = this.currentLocationToPoint(previous);
        var distance = getDistance(point, currentPnt);
        var rel =  {
            distance: Math.round(distance),
            distanceOutside: Math.round(distance - (site.grid * 0.3)),
            bearing: getBearingString(point, currentPnt),
            // Calculated bearing from atan2 based on counter-clockwise angle from (1,0) in four quadrant system.
            // Compass uses azimuth angles, so you have to switch bearingDeg to azimuth values by subtracting from 360.
            compassBearing: 360 - Math.round(getBearing(point, currentPnt)),
            motionHeading: 360 - Math.round(getBearing(currentPnt, prevPnt))
        };
        return rel;
    };

    return my;
});