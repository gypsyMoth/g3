/**
 * Created by Ian on 12/22/13.
 */

/*

 new object[] {719260,4981714,14,-96.220537695,44.956966172},
 new object[] {673287,4798532,15,-90.863035668,43.321608218},
 new object[] {269918,4908228,16,-89.883982884,44.292842819},
 new object[] {369000,4230000,17,-82.496129896,38.210347828},
 new object[] {255000,4005000,18,-77.723231329,36.160698197},
 */

describe( "Coordinate Converter", function () {

    describe( "Project WGS84 Lat/Lon to Nad27 UTM", function () {
        it("Works in zone 14", function() {
            var p = {Lon:-96.220537695, Lat:44.956966172};
            p = CoordinateConverter.datumShift(p);
            expect(CoordinateConverter.project(p)).toEqual({Easting:719260, Northing:4981714, Zone:14});
        }),
        it("Works in zone 15", function() {
            var p = {Lon:-90.863035668, Lat:43.321608218};
            p = CoordinateConverter.datumShift(p);
            expect(CoordinateConverter.project(p)).toEqual({Easting:673287, Northing:4798532, Zone:15});
        }),
        it("Works in zone 16", function() {
            var p = {Lon:-89.883982884, Lat:44.292842819};
            p = CoordinateConverter.datumShift(p);
            expect(CoordinateConverter.project(p)).toEqual({Easting:269918, Northing:4908228, Zone:16});
        }),
        it("Works in zone 17", function() {
            var p = {Lon:-82.496129896, Lat:38.210347828};
            p = CoordinateConverter.datumShift(p);
            expect(CoordinateConverter.project(p)).toEqual({Easting:369000, Northing:4230000, Zone:17});
        }),
        it("Works in zone 18", function() {
            var p = {Lon:-77.723231329, Lat:36.160698197};
            p = CoordinateConverter.datumShift(p);
            expect(CoordinateConverter.project(p)).toEqual({Easting:255000, Northing:4005000, Zone:18});
        });
    });

    /*
    describe("datum shift", function() {
       it("Takes a geographic point input and returns a geographic point output", function() {
           var p = {Lon:0, Lat:0};
           expect(CoordinateConverter.datumShift(p)).toEqual(p);
       });
    });
    */
});
