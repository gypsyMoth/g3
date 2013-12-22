/**
 * Created by Ian on 12/22/13.
 */

describe( "projection library", function () {
    describe( "wgs84 lat/lon to nad27 UTM converter", function () {
        it("Takes an input tuple and returns a triple", function() {
            expect(CoordinateConverter.project({Lon:0, Lat:0}).toEqual({Easting:0, Northing:0, Zone:0}));
        })
    });
});
