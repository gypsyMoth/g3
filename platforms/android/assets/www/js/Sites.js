/**
 * Created by Ian on 12/28/13.
 */
var Sites = (function () {
    var my = {};
    my.List = [];

    my.Nearest = function(point) {
        var minDistance = Number.MAX_VALUE;
        var pCurrent = {x: point.Easting, y: point.Northing};
        var nearest = this.List[0];
        for (var i = 0, len = this.List.length; i < len; i++) {
            var s = this.List[i];
            if (s.zone === point.Zone) {
                var p = {x: s.xth, y: s.yth};
                var d = distance(p, pCurrent);
                if (d < minDistance) {
                    nearest = s;
                    minDistance = d;
                }
            }
        }
        return nearest;
    }

    var distance = function(p2, p1) {
        return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
    };

    return my;
}());