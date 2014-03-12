define (['src/models/RelativePosition'], function (RelativePosition) { 'use strict';
    var my = {};

    my.Nearest = function(currentLocation, sites) {
        
        var nearestSites  = initializeNearestSites(5),
             currentPoint = {x: currentLocation.Easting, y: currentLocation.Northing},
             nearestSite = {quad: '', site: ''},
             point,
             distance,
             site,
             i,
             len;

        for (i = 0, len = sites.length; i < len; i++) {
            site = sites[i];
            if (site.zone === currentLocation.Zone) {
                //siteFound = true;
                point = getPoint(site);
                distance = getDistance(point, currentPoint);

                if (distance < nearestSites[0].relativePosition.get('distance')) {
                    nearestSites[0].site = site;
                    nearestSites[0].relativePosition.set('distance', Math.round(distance));
                    nearestSites[0].relativePosition.set('distanceOutside', Math.round(distance - (site.grid * 0.3)));
                    nearestSites[0].relativePosition.set('bearing', getBearingString(currentPoint, getPoint(site)));
                    nearestSites[0].relativePosition.set('found', true);
                }
            }
        }

        return nearestSites[0];
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