/**
 * Created by Ian on 12/28/13.
 */
app.Sites = (function () {
    var my = {};

    my.Nearest = function(currentLocation, sites) {
        var outside = true;
        var bearing = "X";
        var minDistance = Number.MAX_VALUE;
        var pCurrent = {x: currentLocation.Easting, y: currentLocation.Northing};
        var nearest = {
            quad: '',
            site_id: ''
        };
        var foundSite = false;
        for (var i = 0, len = sites.length; i < len; i++) {
            var s = sites[i];
            if (s.zone === currentLocation.Zone) {
                foundSite = true;
                var p = {x: s.xth, y: s.yth};
                var d = getDistance(p, pCurrent);
                if (d < minDistance) {
                    nearest = s;
                    minDistance = d;
                }
            }
        }
        if (foundSite) {
            outside = minDistance - (nearest.grid * 0.3);
            bearing = getBearingString(pCurrent, {x: nearest.xth, y: nearest.yth});
        }
        return {
            site: nearest,
            relativePosition: {
                Distance: Math.round(minDistance,0),
                Bearing: bearing,
                DistanceOutside: Math.round(outside, 0),
                Found: foundSite
            }
        };
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
}());