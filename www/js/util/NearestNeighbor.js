define (['underscore', 'src/models/RelativePosition'], function (_, RelativePosition) { 'use strict';
    var my = {};

    my.nearestSites = [];

    my.Nearest = function(currentLocation, sites) {
        
        var currentPoint = {x: currentLocation.Easting, y: currentLocation.Northing},
             nearestSite = {quad: '', site: ''},
             point,
             distance,
             site,
             i,
             len,
             furthestSite;

        my.nearestSites = initializeNearestSites(5);

        for (i = 0, len = sites.length; i < len; i++) {
            site = sites[i];
            if (site.zone === currentLocation.Zone) {
                point = getPoint(site);
                distance = getDistance(point, currentPoint);
                furthestSite = isCloser(distance);
                if (furthestSite !== 'undefined') {
                    assignSite(furthestSite, distance, site, currentPoint);
                }
            }
        }
        my.nearestSites = _.sortBy(my.nearestSites, function(site){return site.relativePosition.get('distance'); });

        return my.nearestSites;
    };

    var isCloser = function(distance) {
        var furthestSite = null;        
        my.nearestSites = _.sortBy(my.nearestSites, function(site){return -(site.relativePosition.get('distance')); });

        _.each(my.nearestSites, function(site) {
            if (distance < site.relativePosition.get('distance')) {
                furthestSite = site;
            }
        });
        
        return furthestSite;
    };

    var assignSite = function (furthest, distance, site, currentPoint) {
        furthest.site = site;
        furthest.relativePosition.set('distance', Math.round(distance));
        furthest.relativePosition.set('distanceOutside', Math.round(distance - (site.grid * 0.3)));
        furthest.relativePosition.set('bearing', getBearingString(currentPoint, getPoint(site)));
        furthest.relativePosition.set('found', true);
    };
    
    var initializeNearestSites = function(numberOfPoints) {
        var nearestPoints = [],
            i;
        for (i = 0; i < numberOfPoints; i++) {
            nearestPoints.push({site: null, relativePosition: new RelativePosition()});
        }
        return nearestPoints;
    };

    var getPoint = function(site) {
        var point;
        if (typeof (site.xact) === 'undefined' || typeof (site.yact) === 'undefined') {
            point = {x: site.xth, y: site.yth};
        } else {
            point = {x: site.xact, y: site.yact};
        }
        return point;
    };

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

        if (b >= 337.5 || b < 22.5) ret = "N";
        else if (b >= 22.5 && b < 67.5) ret = "NW";
        else if (b > 67.5 && b < 112.5) ret = "W";
        else if (b > 112.5 && b < 157.5) ret = "SW";
        else if (b >= 157.5 && b < 202.5) ret = "S";
        else if (b > 202.5 && b < 247.5) ret = "SE";
        else if (b > 247.5 && b < 292.5) ret = "E";
        else if (b >= 292.5 && b < 337.5) ret = "NE";

        return ret;
    };

    return my;
});