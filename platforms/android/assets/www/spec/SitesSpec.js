/**
 * Created by Ian on 12/28/13.
 */
describe( "Sites", function () {
    it("Exists", function() {
        expect(Sites).toBeDefined();
    });

    it ("Has a Nearest method", function(){
        expect(Sites.Nearest).toBeDefined();
    });

    describe ("Uses a test list of sites", function() {

        var list = [
            {"zone":17,"xth":"536000","yth":"4184000","quad":"TEST","site_id":1,"grid":"8000","trap_type":"Milk Carton","moth_count":0},
            {"zone":18,"xth":"528000","yth":"4168000","quad":"TEST","site_id":2,"grid":"8000","trap_type":"Milk Carton","moth_count":0},
            {"zone":17,"xth":"528000","yth":"4176000","quad":"TEST","site_id":3,"grid":"8000","trap_type":"Milk Carton","moth_count":0}
        ];

        it ("Has a Nearest method that returns a Point and Distance", function() {
            var pIn = {Easting: 528050, Northing: 4176000, Zone: 17};
            var nearest = Sites.Nearest(pIn, list);
            var pOut = nearest.Site;
            expect(pOut.quad).toBeDefined();
            expect(pOut.site_id).toBeDefined();
            expect(pOut.xth).toBeDefined();
            expect(pOut.yth).toBeDefined();
            expect(pOut.zone).toBeDefined();
            expect(nearest.Distance).toBeDefined();
        });

        it ("Returns the nearest site and correct distance, in the current zone, even if there are sites in multiple zones", function() {
            var pIn = {Easting: 528000, Northing: 4170000, Zone: 17};
            var nearest = Sites.Nearest(pIn, list);
            var pOut = nearest.Site;
            expect(pOut).toEqual(list[2]);
            expect(nearest.Distance).toEqual(6000);
        });

        it("Returns Found = false when no sites in zone", function() {
           var list = [
               {"zone":17,"xth":"446000","yth":"4118000","quad":"TAZEN","site_id":40,"grid":"2000","trap_type":"Delta","moth_count":0},
               {"zone":17,"xth":"446000","yth":"4120000","quad":"TAZEN","site_id":24,"grid":"2000","trap_type":"Delta","moth_count":0},
               {"zone":17,"xth":"446000","yth":"4122000","quad":"TAZEN","site_id":2,"grid":"2000","trap_type":"Delta","moth_count":0}
               ];
            var pIn = {Easting: 528000, Northing: 4170000, Zone: 15};
            var nearest = Sites.Nearest(pIn, list);
            var pOut = nearest.Site;
            expect(nearest.Found).toEqual(false);
        });
    });
});