define(['underscore',
    'src/util/NearestNeighbor',
    'src/models/NearestSite',
    'src/models/RelativePosition',
    'src/collections/NearestSiteCollection'],
    function(_, NearestNeighbor, NearestSite, RelativePosition, NearestSiteCollection) { 'use strict';
    
    describe( "Nearest Neighbor Module", function () {
        it("Exists", function() {
            expect(NearestNeighbor).toBeDefined();
        });

        it("Can convert from CurrentPosition to a point", function() {
            var currentUtm = {
                Easting: 100,
                Northing: 1000000,
                Zone: 17
            };

            var point = NearestNeighbor.currentLocationToPoint(currentUtm);
            expect(point).toEqual({x: 100, y: 1000000});
        });

        it("Has a method to initialize the nearest sites", function() {
           var nearestSites = NearestNeighbor.initializeNearestSites(5);
           expect(nearestSites.length).toEqual(5);
           nearestSites.each(function(nearest) {
              expect(nearest.get('site')).toBeDefined();
              expect(nearest.get('relativePosition')).toBeDefined();
           });
        });

        it("Uses actual coordinates if available, otherwise, grid node", function() {
           var siteActual = {xth: 123456, yth: 1234567, xact: 234567, yact: 2345678};
           var siteTheoretical = {xth: 123456, yth: 1234567};
           var pointActual = NearestNeighbor.getPoint(siteActual);
           var pointTheoretical = NearestNeighbor.getPoint(siteTheoretical);
           expect(pointActual).toEqual({x: 234567, y: 2345678});
           expect(pointTheoretical).toEqual({x: 123456, y: 1234567});
        });
        
        describe("Returning the n nearest sites from a list", function() {
            var list = [
                {quad: 'TEST', site_id: 1, zone: 17, xth: 300, yth: 1000000, grid: 100},
                {quad: 'TEST', site_id: 2, zone: 17, xth: 400, yth: 1000000, grid: 100},
                {quad: 'TEST', site_id: 3, zone: 17, xth: 500, yth: 1000000, grid: 100},
                {quad: 'TEST', site_id: 4, zone: 17, xth: 900, yth: 1000000, grid: 100},
                {quad: 'TEST', site_id: 5, zone: 17, xth: 700, yth: 1000000, grid: 100},
                {quad: 'TEST', site_id: 6, zone: 17, xth: 800, yth: 1000000, grid: 100}
            ];

            var currentUtm = {
                Easting: 100,
                Northing: 1000000,
                Zone: 17
            };

            it("Returns the single nearest site", function() {
                var nearest = NearestNeighbor.getNearestSites(currentUtm, list, 1);
                expect(nearest.first().get('site')).toEqual({quad: 'TEST', site_id: 1, zone: 17, xth: 300, yth: 1000000, grid: 100});
            });

            it("Returns the two nearest sites", function() {
                var nearest = NearestNeighbor.getNearestSites(currentUtm, list, 2);
                expect(nearest.first().get('site')).toEqual({quad: 'TEST', site_id: 1, zone: 17, xth: 300, yth: 1000000, grid: 100});
                expect(nearest.last().get('site')).toEqual({quad: 'TEST', site_id: 2, zone: 17, xth: 400, yth: 1000000, grid: 100});
            });

            it("Returns the total number of sites when the list is smaller than the number of nearest sites requested", function() {
                var i,
                    nearest = NearestNeighbor.getNearestSites(currentUtm, list, 7);
                expect(nearest.length).toEqual(6);

                for (i = 0; i < nearest.models.length - 1; i++) {
                    expect(nearest.models[i].get('site').site_id).not.toEqual('');
                }
            });
        });

        describe("Sorting sites", function() {

            var sites;

            beforeEach(function() {
                sites = new NearestSiteCollection([
                    //new NearestSite({site: {xth: 200, yth: 1000000}, relativePosition: new RelativePosition({distance: 100})}),
                    new NearestSite({site: {site_id: 2, xth: 300, yth: 1000000}, relativePosition: new RelativePosition({distance: 200})}),
                    new NearestSite({site: {site_id: 3, xth: 400, yth: 1000000}, relativePosition: new RelativePosition({distance: 300})}),
                    new NearestSite({site: {site_id: 4, xth: 500, yth: 1000000}, relativePosition: new RelativePosition({distance: 400})}),
                    new NearestSite({site: {site_id: 5, xth: 600, yth: 1000000}, relativePosition: new RelativePosition({distance: 500})}),
                    new NearestSite({site: {site_id: 0}}) // default distance is max value
                ]);
            });

            it("Can sort ascending", function() {
               NearestNeighbor.sortByDistanceAscending(sites); // 2,3,4,5,0
               expect(sites.at(0).get('site').site_id).toEqual(2);
               expect(sites.at(4).get('site').site_id).toEqual(0);
            });

            it("Can sort descending", function() { // 0,5,4,3,2
                NearestNeighbor.sortByDistanceDescending(sites);
                expect(sites.at(0).get('site').site_id).toEqual(0);
                expect(sites.at(4).get('site').site_id).toEqual(2);
            });

            it("Has a method to return the most distant of the closest sites", function() {
                var distance = 400;
                var expectedSite = new NearestSite({site: {site_id: 5, xth: 600, yth: 1000000}, relativePosition: new RelativePosition({distance: 500})});
                var siteToReplace = NearestNeighbor.getSiteToReplace(distance, sites);
                expect(siteToReplace.get('site')).toEqual(expectedSite.get('site'));
            });

        });

        it("Has a method to find the relative position of a single site", function() {
            var site = {
                "zone":17,
                "xth":"500000",
                "yth":"4000000",
                "quad":"TEST",
                "site_id":1,
                "grid":"8000",
                "trap_type":"Milk Carton",
                "moth_count":0
            };

            var currentUtm = {
                Easting: 4000000,
                Northing: 30000000,
                Zone: 17
            };

            var selectedSite = NearestNeighbor.getSelectedSite(currentUtm, site);
            expect(selectedSite.get('site')).toEqual(site);
        });
    
        describe( "Sites", function() {
    
            it ("Returns the distance between the site and the actual point if it exists", function() {
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
                }];
                var pIn = {Easting: 500000, Northing: 4000000, Zone: 17};
                var nearest = NearestNeighbor.getNearestSites(pIn, list, 5);
                expect(nearest.first().get('relativePosition').get('distance')).toEqual(100);
            });
    
            it ("Returns the distance between the site and the grid node, if there is no actual point", function() {
                var list = [{
                    "zone":17,
                    "xth":"500000",
                    "yth":"4000100",
                    "quad":"TEST",
                    "site_id":1,
                    "grid":"8000",
                    "trap_type":"Milk Carton",
                    "moth_count":0
                }];
                var pIn = {Easting: 500000, Northing: 4000000, Zone: 17};
                var nearest = NearestNeighbor.getNearestSites(pIn, list, 5);
                expect(nearest.first().get('relativePosition').get('distance')).toEqual(100);
            });
    
            it ("Returns the nearest site and correct distance in the current zone, even if there are sites in multiple zones", function() {
                var list = [
                    {"zone":17,"xth":"536000","yth":"4184000","quad":"TEST","site_id":1,"grid":"8000","trap_type":"Milk Carton","moth_count":0},
                    {"zone":18,"xth":"528000","yth":"4168000","quad":"TEST","site_id":2,"grid":"8000","trap_type":"Milk Carton","moth_count":0},
                    {"zone":17,"xth":"528000","yth":"4176000","quad":"TEST","site_id":3,"grid":"8000","trap_type":"Milk Carton","moth_count":0}
                ];
    
                var pIn = {Easting: 528000, Northing: 4170000, Zone: 17};
                var nearest = NearestNeighbor.getNearestSites(pIn, list, 5);
                var pOut = nearest.first().get('site');
                expect(pOut).toEqual(list[2]);
                expect(nearest.first().get('relativePosition').get('distance')).toEqual(6000);
            });
    
            it("Returns Found = false when no sites in zone", function() {
               var list = [
                   {"zone":17,"xth":"446000","yth":"4118000","quad":"TAZEN","site_id":40,"grid":"2000","trap_type":"Delta","moth_count":0},
                   {"zone":17,"xth":"446000","yth":"4120000","quad":"TAZEN","site_id":24,"grid":"2000","trap_type":"Delta","moth_count":0},
                   {"zone":17,"xth":"446000","yth":"4122000","quad":"TAZEN","site_id":2,"grid":"2000","trap_type":"Delta","moth_count":0}
               ];
                var pIn = {Easting: 528000, Northing: 4170000, Zone: 15};
                var nearest = NearestNeighbor.getNearestSites(pIn, list, 5);
                expect(nearest.first().get('relativePosition').get('found')).toEqual(false);
            });
        });
    
        describe("Bearing", function() {
            var list = [
                {"zone":17,"xth":"446000","yth":"4118000","quad":"TAZEN","site_id":40,"grid":"3000","trap_type":"Delta","moth_count":0}
            ];
    
            var bearingTest = function(currentLocation, expectedBearing) {
                var nearest = NearestNeighbor.getNearestSites(currentLocation, list, 5);
                expect(nearest.first().get('relativePosition').get('bearing')).toEqual(expectedBearing);
            };
    
            it("Returns 'N' when we're north of the point", function() {
                  bearingTest({Easting: 446000, Northing: 4119000, Zone: 17}, "S");
            });
    
            it("Returns 'S' when we're south of the point", function() {
                bearingTest({Easting: 446000, Northing: 4117000, Zone: 17}, "N");
            });
    
            it("Returns 'E' when we're east of the point", function() {
                bearingTest({Easting: 447000, Northing: 4118000, Zone: 17}, "W");
            });
    
            it("Returns 'W' when we're west of the point", function() {
                bearingTest({Easting: 445000, Northing: 4118000, Zone: 17}, "E");
            });
        });
    
        describe("Target Circle", function() {
            var list = [
                {"zone":17,"xth":"446000","yth":"4118000","quad":"TAZEN","site_id":40,"grid":"3000","trap_type":"Delta","moth_count":0}
            ];
           it("Is < 0 when the current position is within 30% of the grid distance of the nearest site", function() {
               var pIn = {Easting: 445999, Northing: 4118000, Zone: 17}; // 1 meter away
               var nearest = NearestNeighbor.getNearestSites(pIn, list, 5);
               expect(nearest.first().get('relativePosition').get('distanceOutside')).toBeLessThan(0);
           });
    
            it("Is > 0 when the current position is greater than 30% of the grid distance of the nearest site", function() {
                var pIn = {Easting: 445099, Northing: 4118000, Zone: 17}; // 901 meters away
                var nearest = NearestNeighbor.getNearestSites(pIn, list, 5);
                expect(nearest.first().get('relativePosition').get('distanceOutside')).toBeGreaterThan(0);
            });
    
        });
    });
});