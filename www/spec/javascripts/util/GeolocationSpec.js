define(['src/util/Geolocation'], function(Geolocation) { 'use strict';
    describe("Geolocation Module", function() {
        it("Has a start method", function() {
            expect(Geolocation.start).toBeDefined();
        });

        it("Has a stop method", function() {
            expect(Geolocation.stop).toBeDefined();
        });

        it("Can look up a site in the list by ID", function() {
            var list = [{
                "zone":17,
                "xth":"500000",
                "yth":"4000000",
                "xact": "500000",
                "yact": "4000100",
                "quad":"TEST",
                "site_id":1,
                "grid":"8000",
                "trap_type":"Milk Carton",
                "moth_count":0
            },{
                "zone":17,
                "xth":"600000",
                "yth":"5000000",
                "xact": "400000",
                "yact": "3000100",
                "quad":"TEST",
                "site_id":2,
                "grid":"8000",
                "trap_type":"Milk Carton",
                "moth_count":0
            }];

            Geolocation.SitesList = list;
            expect(Geolocation.SitesList).toEqual(list);
            var site = Geolocation.getSiteById('TEST', 2);
            expect(site).toEqual(list[1]);
        });

//        it("Doesn't update the nearest site when manualLock is set", function() {
//           Geolocation.Here.set('manualLock', true);
//
//            var position = {
//                coords: {
//                    latitude: 37,
//                    longitude: -81,
//                    accuracy: 10
//                }
//            };
//
//           spyOn(Geolocation, "findNearest");
//           Geolocation.onPositionUpdate(position);
//
//           expect(Geolocation.findNearest).not.toHaveBeenCalled();
//        });
    });
});
