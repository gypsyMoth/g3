define (['underscore',
    'src/models/RelativePosition',
    'src/models/NearestSite',
    'src/collections/NearestSiteCollection'],
    function (_, RelativePosition, NearestSite, NearestSiteCollection) { 'use strict';
    var my = {};

    my.nearestSites = null;

    my.Nearest = function(currentLocation, sites) {
        
        var currentPoint = {x: currentLocation.Easting, y: currentLocation.Northing},
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
                furthestSite = getFurthestSite(distance);
                if (furthestSite !== 'undefined') {
                    assignSite(furthestSite, distance, site, currentPoint);
                }
            }
        }
        my.nearestSites.comparator = function(site){return site.get('relativePosition').get('distance'); };
        my.nearestSites.sort();

        return my.nearestSites;
    };

    var getFurthestSite = function(distance) {
        var furthestSite = null;
        my.nearestSites.comparator = function(site){return -(site.get('relativePosition').get('distance')); };
        my.nearestSites.sort();

        my.nearestSites.each(function(site) {
            if (distance < site.get('relativePosition').get('distance')) {
                furthestSite = site;
            }
        });
        
        return furthestSite;
    };

    var assignSite = function (furthest, distance, site, currentPoint) {
        furthest.set('site', site);
        var relativePosition = furthest.get('relativePosition');
        relativePosition.set('distance', Math.round(distance));
        relativePosition.set('distanceOutside', Math.round(distance - (site.grid * 0.3)));
        relativePosition.set('bearing', getBearingString(getPoint(site), currentPoint));
        relativePosition.set('found', true);
    };
    
    var initializeNearestSites = function(numberOfPoints) {
        var nearestPoints = new NearestSiteCollection(),
            i;
        for (i = 0; i < numberOfPoints; i++) {
            nearestPoints.push(new NearestSite({relativePosition: new RelativePosition()}));
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