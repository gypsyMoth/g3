define(['underscore',
    'src/models/CurrentPosition',
    'src/models/RelativePosition',
    'src/models/NearestSite',
    'src/collections/NearestSiteCollection'
], function(_, CurrentPosition, RelativePosition, NearestSite, NearestSiteCollection) { 'use strict';

    describe("CurrentPosition Model", function() {
        var current;

        beforeEach( function() {
            current = new CurrentPosition();
        });

        it("Can be created", function() {
           expect(current).toBeDefined();
       });

        it("Has a manualLock property", function() {
            expect(current.get('manualLock')).toBeDefined();
        });

        it("Has a selectedSite property", function() {
            expect(current.get('selectedSite')).toBeDefined();
        });

        describe("Changes the message when the selected site changes", function() {

            var expectMessageToMatchSite = function(site, expectedMessage) {
                var relativePosition = new RelativePosition({
                    distance: '10',
                    found: false,
                    bearing: 'N',
                    distanceOutside: 0
                });

                var nearest = _.clone(current.get('selectedSite'));
                nearest.set({site: site, relativePosition: relativePosition});
                current.set('selectedSite', nearest);
                expect(current.get('message')).toEqual(expectedMessage);
            };

            it ("Displays unaddressed message", function() {
                var unaddressed = {
                    "zone":15,
                    "xth":"329229",
                    "yth":"3475979",
                    "quad":"FIREP",
                    "site_id":1,
                    "grid":"30",
                    "trap_type":"Milk Carton",
                    "moth_count":0
                };
                expectMessageToMatchSite(unaddressed, 'No trap at this site');
            });

            it ("Displays placed delta message", function() {
                var delta = {
                    "zone":17,
                    "xth":"700028",
                    "yth":"4141028",
                    "xact":"700028",
                    "yact":"4141028",
                    "quad":"HOLID",
                    "site_id":9009,
                    "grid":"9999",
                    "trap_type":"Delta",
                    "moth_count":0,
                    "txn_date":"2013-02-06T00:00:00-00:00"
                };
                expectMessageToMatchSite(delta, 'Delta trap placed here on 02/06/13');
            });

            it ("Displays placed milk carton message", function() {
                var milkCarton = {
                    "zone":17,
                    "xth":"700028",
                    "yth":"4141028",
                    "xact":"700028",
                    "yact":"4141028",
                    "quad":"HOLID",
                    "site_id":9009,
                    "grid":"9999",
                    "trap_type":"Milk Carton",
                    "moth_count":0,
                    "txn_date":"2013-02-06T00:00:00-00:00"
                };
                expectMessageToMatchSite(milkCarton, 'Milk Carton trap placed here on 02/06/13');
            });
        });

        describe("Save changes to the sites list", function() {
            it("Has a saveSites method defined", function() {
                expect(current.saveSites).toBeDefined();
            });

            it("Writes the operation values to site on commit", function() {
                var model = new CurrentPosition();
                model.set({currentUtm: {Easting: 123456, Northing: 1234567, Zone: 15}});
                model.set({operation: {easting: 123456, northing: 1234567, traptype: 'Milk Carton', date: '2014-01-24T00:00:00-00:00'}});
                model.nearestSites.add(new NearestSite({site: {"zone":15,"xth":"329229","yth":"3475979","quad":"FIREP","site_id":1,"grid":"30","trap_type":"Delta","moth_count":0}}));
                model.set('selectedSite', model.nearestSites.first());
                model.saveSites();

                var site = model.nearestSites.first().get('site');
                expect(site.xact).toBeDefined();
                expect(site.xact).toEqual(123456);
                expect(site.yact).toBeDefined();
                expect(site.yact).toEqual(1234567);
                expect(site.txn_date).toBeDefined();
                expect(site.txn_date).toEqual('2014-01-24T00:00:00-00:00');
                expect(site.trap_type).toBeDefined();
                expect(site.trap_type).toEqual('Milk Carton');
            });
        });
    });
});