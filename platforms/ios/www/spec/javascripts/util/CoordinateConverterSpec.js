/**
 * Created by Ian on 12/22/13.
 */
describe( "CoordinateConverter Module", function () {

    describe( "Project WGS84 Lat/Lon to Nad27 UTM", function () {

        var expectPointsToBeEqual= function(wgs84LatLonPoint, utmPoint) {
            var nad27LatLonPoint = app.CoordinateConverter.datumShift(wgs84LatLonPoint);
            expect(app.CoordinateConverter.project(nad27LatLonPoint)).toEqual(utmPoint);
        };

        it("Works in zone 14", function() {
            expectPointsToBeEqual({Lon:-96.220537695, Lat:44.956966172}, {Easting:719260, Northing:4981714, Zone:14});
        }),

        it("Works in zone 15", function() {
            expectPointsToBeEqual({Lon:-90.863035668, Lat:43.321608218}, {Easting:673287, Northing:4798532, Zone:15});
        }),

        it("Works in zone 16", function() {
            expectPointsToBeEqual({Lon:-89.883982884, Lat:44.292842819}, {Easting:269918, Northing:4908228, Zone:16});
        }),

        it("Works in zone 17", function() {
            expectPointsToBeEqual({Lon:-82.496129896, Lat:38.210347828}, {Easting:369000, Northing:4230000, Zone:17});
        }),

        it("Works in zone 18", function() {
            expectPointsToBeEqual({Lon:-77.723231329, Lat:36.160698197}, {Easting:255000, Northing:4005000, Zone:18});
        });
    });
});
