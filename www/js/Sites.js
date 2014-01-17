/**
 * Created by Ian on 12/28/13.
 */
var Sites = (function () {
    var my = {};

    my.Nearest = function(currentLocation, sites) {
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
                var d = distance(p, pCurrent);
                if (d < minDistance) {
                    nearest = s;
                    minDistance = d;
                }
            }
        }
        return {Site: nearest, Distance: Math.sqrt(minDistance), Found: foundSite};
    }

    var distance = function(p2, p1) {
        return (Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };

    return my;
}());