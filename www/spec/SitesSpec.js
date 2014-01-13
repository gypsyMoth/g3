/**
 * Created by Ian on 12/28/13.
 */
describe( "Sites", function () {

    describe( "Get sites file", function () {
        it("Exists", function() {
            expect(Sites).toBeDefined();
        }),

        it("Has a list of site objects", function (){
            expect(Sites.List).toBeDefined();
        }),

        it ("Has a Nearest method", function(){
            expect(Sites.Nearest).toBeDefined();
//            expect(typeof (Sites.NearestPoint)).toBe("function");
        }),

        describe ("Uses a test list of sites", function() {

            Sites.List = [
                {"zone":17,"xth":"536000","yth":"4184000","quad":"TEST","site_id":1,"grid":"8000","trap_type":"Milk Carton","moth_count":0},
                {"zone":18,"xth":"528000","yth":"4168000","quad":"TEST","site_id":2,"grid":"8000","trap_type":"Milk Carton","moth_count":0},
                {"zone":17,"xth":"528000","yth":"4176000","quad":"TEST","site_id":3,"grid":"8000","trap_type":"Milk Carton","moth_count":0}
            ];

            it ("Has a Nearest method that returns a Point", function() {
                var pIn = {Easting: 528050, Northing: 4176000, Zone: 17};
                var pOut = Sites.Nearest(pIn);
                expect(pOut.quad).toBeDefined();
                expect(pOut.site_id).toBeDefined();
                expect(pOut.xth).toBeDefined();
                expect(pOut.yth).toBeDefined();
                expect(pOut.zone).toBeDefined();
            });

            it ("Returns the nearest site in the current zone, even if there are sites in multiple zones", function() {
                var pIn = {Easting: 528000, Northing: 4170000, Zone: 17};
                var pOut = Sites.Nearest(pIn);
                expect(pOut).toEqual(Sites.List[2]);
            });
        });
    });
});