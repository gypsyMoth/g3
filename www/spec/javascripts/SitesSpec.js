/**
 * Created by Ian on 12/28/13.
 */
describe( "Sites Module", function () {
    it("Exists", function() {
        expect(app.Sites).toBeDefined();
    });

    describe( "Sites Tests", function() {
        var list = [
            {"zone":17,"xth":"536000","yth":"4184000","quad":"TEST","site_id":1,"grid":"8000","trap_type":"Milk Carton","moth_count":0},
            {"zone":18,"xth":"528000","yth":"4168000","quad":"TEST","site_id":2,"grid":"8000","trap_type":"Milk Carton","moth_count":0},
            {"zone":17,"xth":"528000","yth":"4176000","quad":"TEST","site_id":3,"grid":"8000","trap_type":"Milk Carton","moth_count":0}
        ];

        it ("Has a Nearest method that returns a Point and Distance", function() {
            var pIn = {Easting: 528050, Northing: 4176000, Zone: 17};
            var nearest = app.Sites.Nearest(pIn, list);
            var pOut = nearest.site;
            expect(pOut.quad).toBeDefined();
            expect(pOut.site_id).toBeDefined();
            expect(pOut.xth).toBeDefined();
            expect(pOut.yth).toBeDefined();
            expect(pOut.zone).toBeDefined();
            expect(nearest.relativePosition.Distance).toBeDefined();
        });

        it ("Returns the nearest site and correct distance, in the current zone, even if there are sites in multiple zones", function() {
            var pIn = {Easting: 528000, Northing: 4170000, Zone: 17};
            var nearest = app.Sites.Nearest(pIn, list);
            var pOut = nearest.site;
            expect(pOut).toEqual(list[2]);
            expect(nearest.relativePosition.Distance).toEqual(6000);
        });

        it("Returns Found = false when no sites in zone", function() {
           var list = [
               {"zone":17,"xth":"446000","yth":"4118000","quad":"TAZEN","site_id":40,"grid":"2000","trap_type":"Delta","moth_count":0},
               {"zone":17,"xth":"446000","yth":"4120000","quad":"TAZEN","site_id":24,"grid":"2000","trap_type":"Delta","moth_count":0},
               {"zone":17,"xth":"446000","yth":"4122000","quad":"TAZEN","site_id":2,"grid":"2000","trap_type":"Delta","moth_count":0}
               ];
            var pIn = {Easting: 528000, Northing: 4170000, Zone: 15};
            var nearest = app.Sites.Nearest(pIn, list);
            var pOut = nearest.site;
            expect(nearest.relativePosition.Found).toEqual(false);
        });
    });

    describe("Bearing tests", function() {
        var list = [
            {"zone":17,"xth":"446000","yth":"4118000","quad":"TAZEN","site_id":40,"grid":"3000","trap_type":"Delta","moth_count":0}
        ];

        var bearingTest = function(currentLocation, expectedBearing) {
            var nearest = app.Sites.Nearest(currentLocation, list);
            var pOut = nearest.site;
            expect(nearest.relativePosition.Bearing).toEqual(expectedBearing);
        };

        it("Returns 'N' when we're north of the point", function() {
            bearingTest({Easting: 446000, Northing: 4119000, Zone: 17}, "N");
        });

        it("Returns 'S' when we're south of the point", function() {
            bearingTest({Easting: 446000, Northing: 4117000, Zone: 17}, "S");
        });

        it("Returns 'E' when we're east of the point", function() {
            bearingTest({Easting: 447000, Northing: 4118000, Zone: 17}, "E");
        });

        it("Returns 'W' when we're west of the point", function() {
            bearingTest({Easting: 445000, Northing: 4118000, Zone: 17}, "W");
        });
    });

    describe("Target Circle Tests", function() {
        var list = [
            {"zone":17,"xth":"446000","yth":"4118000","quad":"TAZEN","site_id":40,"grid":"3000","trap_type":"Delta","moth_count":0}
        ];
       it("Is < 0 the current position is within 30% of the grid distance of the nearest site", function() {
           var pIn = {Easting: 445999, Northing: 4118000, Zone: 17}; // 1 meter away
           var nearest = app.Sites.Nearest(pIn, list);
           var pOut = nearest.site;
           expect(nearest.relativePosition.DistanceOutside).toBeLessThan(0);
       });

        it("Is > 0 when the current position is greater than 30% of the grid distance of the nearest site", function() {
            var pIn = {Easting: 445099, Northing: 4118000, Zone: 17}; // 901 meters away
            var nearest = app.Sites.Nearest(pIn, list);
            var pOut = nearest.site;
            expect(nearest.relativePosition.DistanceOutside).toBeGreaterThan(0);
        });

    });
});