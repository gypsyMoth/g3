define(['jquery',
    'src/util/Geolocation'],
    function($, Geolocation) { 'use strict';
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

        describe("Generating site ids for random placements", function() {

            it("Has a function to return the lowest available site id for a random site", function() {
                expect(Geolocation.getNextRandomSiteId()).toBeDefined();
            });

            it("Returns site id of 9000 when there are no other randoms", function() {
                Geolocation.SitesList = [{site_id: 8999}];
                expect(Geolocation.getNextRandomSiteId()).toEqual(9000);
            });

            it("Raises an exception when a random with site id 9999 exists", function() {
                Geolocation.SitesList = [{site_id: 9999}];
                expect(function() { Geolocation.getNextRandomSiteId(); }).toThrow(new RangeError("Too many randoms--random ids must be between 9000 and 9999"));
            });

            it("Has a method to insert a random site into the sites list", function() {
                expect(Geolocation.addRandomSite).toBeDefined();

                var list = [{
                    "zone":17,
                    "xth":"500000",
                    "yth":"4000000",
                    "quad":"TEST",
                    "site_id":1,
                    "grid":"8000",
                    "trap_type":"Milk Carton",
                    "moth_count":0
                },{
                    "zone":17,
                    "xth":"600000",
                    "yth":"5000000",
                    "quad":"TEST",
                    "site_id":2,
                    "grid":"8000",
                    "trap_type":"Milk Carton",
                    "moth_count":0
                }];
                Geolocation.SitesList = list;
                var expectedSites = list.slice(0);

                var randomId = Geolocation.getNextRandomSiteId();
                var randomSite = {
                    "zone":17,
                    "xth":"700000",
                    "yth":"6000000",
                    "quad":"RANDM",
                    "site_id": randomId,
                    "grid":"100",
                    "trap_type":"Milk Carton",
                    "moth_count":0
                };
                expectedSites.push(randomSite);

                Geolocation.addRandomSite(randomSite);

                expect(Geolocation.SitesList).toEqual(expectedSites);

            });
        });
    });
});
