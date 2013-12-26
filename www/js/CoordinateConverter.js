/**
 * Created by Ian on 12/22/13.
 */

var CoordinateConverter = (function () {
    var my = {};

    //Constants
    var DEGREES_TO_RADIANS = Math.PI / 180;
    var RADIANS_TO_DEGREES = 180 / Math.PI;
    var FALSE_EASTING = 500000;
    var K0 = 0.9996;

    var datumNad27 = {
        a: 6378206.4,
        f: 1 / 294.9786982,
        b: function() {
            return this.a * (1 - this.f);
        }
    };

    var datumWgs84 = {
        a: 6378137,
        f: 1 / 298.257223563,
        b: function() {
            return this.a * (1 - this.f);
        }
    };

    my.project = function(point) {
        var lat = DEGREES_TO_RADIANS * point.Lat;
        var lon = point.Lon;

        // Eccentricities
        var e = Math.sqrt(1 - (datumNad27.b() * datumNad27.b()) / (datumNad27.a * datumNad27.a));
        var e1 = e * e / (1 - e * e);

        //Some trig values
        var sinLat = Math.sin(lat);
        var cosLat = Math.cos(lat);
        var tanLat = Math.tan(lat);
        var eSinLat = e * sinLat;
        var eSinLatSquared = Math.pow(eSinLat, 2);

        // Radius of curvature of the earth perpendicular to the meridian plane
        var nu = datumNad27.a / Math.sqrt(1 - eSinLatSquared);

        //Calculate zone, central meridian, and delta lon
        var zone = Math.floor((180 + lon) / 6) + 1;
        var zoneCM = 6 * zone - 183;
        var long0 = lon - zoneCM;
        var p = long0 * DEGREES_TO_RADIANS;

        // Calculate S, the meridional arc through the point
        var n = (datumNad27.a - datumNad27.b()) / (datumNad27.a + datumNad27.b());

        var A = 1 - n + (5 * n * n / 4) * (1 - n);
        A = A + (81 * Math.pow(n, 4) / 64) * (1 - n);
        A = datumNad27.a * A;

        var B = (3 * datumNad27.a * n / 2) * ((1 - n + (7 / 8) * (Math.pow(n, 2) - Math.pow(n, 3)) + (55 / 64) * (Math.pow(n, 4) - Math.pow(n, 5))));
        var C = (15 * datumNad27.a * Math.pow(n, 2) / 16) * ((1 - n + (3 / 4) * (Math.pow(n, 2) - Math.pow(n, 3))));
        var D = (35 * datumNad27.a * Math.pow(n, 3) / 48) * ((1 - n + (11 / 16) * (Math.pow(n, 2) - Math.pow(n, 3))));
        var E = (315 * datumNad27.a * Math.pow(n, 4) / 51) * (1 - n);
        var S = A * lat - B * Math.sin(2 * lat) + C * Math.sin(4 * lat) - D * Math.sin(6 * lat) + E * Math.sin(8 * lat);

        //Coefficients for Easting
        var K1 = S * K0;
        var K2 = nu * sinLat * cosLat * K0 / 2;
        var K3 = nu * sinLat * Math.pow(cosLat, 3) / 24;
        K3 = K3 * (5 - tanLat * tanLat + 9 * e1 * Math.pow(cosLat, 2) + 4 * e1 * e1 * Math.pow(cosLat, 4));
        K3 = K3 * K0;

        //Coefficients for Northing
        var K4 = nu * cosLat * K0;
        var K5 = Math.pow(cosLat, 3) * (nu / 6) * (1 - tanLat * tanLat + e1 * cosLat * cosLat) * K0;

        //Calculate the actual Easting and Northing
        var easting = (K4 * p + K5 * Math.pow(p, 3)) + FALSE_EASTING;
        var northing = K1 + K2 * p * p + K3 * Math.pow(p, 4);

        return {Easting:Math.round(easting), Northing:Math.round(northing), Zone:zone};
    };

    my.datumShift = function(point) {

        // Parameters for molodensky transform
        var m = {
            dX: 8,
            dY: -160,
            dZ: -176
        };

        // We need to work in radians
        var lon = point.Lon * DEGREES_TO_RADIANS;
        var lat = point.Lat * DEGREES_TO_RADIANS;

        // Delta values (TO - FROM)
        var dF = datumNad27.f - datumWgs84.f; // NAD27 - WGS84
        var dA = datumNad27.a - datumWgs84.a; // NAD27 - WGS84
        var from_esq = 2 * datumWgs84.f - datumWgs84.f * datumWgs84.f;

        // Some trig calculations
        var sinLat = Math.sin(lat);
        var cosLat = Math.cos(lat);
        var sinLon = Math.sin(lon);
        var cosLon = Math.cos(lon);
        var sinSqLat = sinLat * sinLat;
        var adb = 1 - datumWgs84.f;
        var dLat = 0;
        var dLon = 0;
        var dH = 0; // dH is height above the ellipsoid, which we ignore.

        var rn = datumWgs84.a / Math.sqrt(1.0 - from_esq * sinSqLat);
        var rm = datumWgs84.a * (1.0 - from_esq) / Math.pow((1.0 - from_esq * sinSqLat), 1.5);

        // Geographic shift for latitude
        dLat = (((((-m.dX * sinLat * cosLon - m.dY * sinLat * sinLon) + m.dZ * cosLat)
            + (dA * ((rn * from_esq * sinLat * cosLat) / datumWgs84.a)))
            + (dF * (rm * adb + rn / adb) * sinLat * cosLat)))
            / (rm + dH);

        // Geographic shift for longitude
        dLon = (-m.dX * sinLon + m.dY * cosLon) / ((rn + dH) * cosLat);

        // Apply the shifts
        lon += dLon;
        lat += dLat;

        // Convert back to degrees
        lon = lon * RADIANS_TO_DEGREES;
        lat = lat * RADIANS_TO_DEGREES;
        
        return {Lon:lon, Lat:lat};
    };

    return my;
}());