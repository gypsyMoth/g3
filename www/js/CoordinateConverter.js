/**
 * Created by Ian on 12/22/13.
 */

var CoordinateConverter = (function () {
    var my = {};

    my.project = function(point) {
        return {Easting:0, Northing:0, Zone:0};
    }

    return my;
}());