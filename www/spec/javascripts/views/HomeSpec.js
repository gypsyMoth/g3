define(["jquery",
    "underscore",
    "knockout",
    "src/util/Controller",
    "src/util/Date",
    "src/viewmodels/Home"
], function($, _, ko, Controller, DateFormatter, HomeView) { 'use strict';

    $(describe("Home ViewModel", function() {
       var view;

        var testSites = {
            unaddressed: {
                "zone":15,
                "xth":"300000",
                "yth":"3000000",
                "quad":"TEST",
                "site_id":1,
                "grid":"300",
                "trap_type":"Delta",
                "moth_count":0
            },
            placedDelta: {
                "zone":15,
                "xth":"300000",
                "yth":"3000000",
                "xact": 400000,
                "yact": 4000000,
                "quad":"TEST",
                "site_id":1,
                "grid":"300",
                "trap_type":"Delta",
                "moth_count":0,
                "txn_date":"2013-02-06T00:00:00-00:00"
            },
            placedMilkCarton: {
                "zone":15,
                "xth":"300000",
                "yth":"3000000",
                "xact": 400000,
                "yact": 4000000,
                "quad":"TEST",
                "site_id":1,
                "grid":"300",
                "trap_type":"Milk Carton",
                "moth_count":0,
                "txn_date":"2013-02-06T00:00:00-00:00"
            },
            midseasonInspection: {
                "zone":17,
                "xth":"700028",
                "yth":"4141028",
                "xact":"700028",
                "yact":"4141028",
                "quad":"HOLID",
                "site_id":9009,
                "grid":"9999",
                "trap_type":"Milk Carton",
                "visit":"MIDSEASON",
                "condition":"GOOD",
                "moth_count":0,
                "txn_date":"2013-02-06T00:00:00-00:00"
            },
            omit: {
                "zone":15,
                "xth":"300000",
                "yth":"3000000",
                "xact": 400000,
                "yact": 4000000,
                "quad":"TEST",
                "site_id":1,
                "grid":"300",
                "trap_type":"Omit",
                "omit_reason":"Nothing to hang trap on",
                "moth_count":0,
                "txn_date":"2013-02-06T00:00:00-00:00"
            }
        };

       beforeEach(function() {
          Controller.viewModel.position({
              latitude:-45,
              longitude:80,
              accuracy:10,
              utm:{
                  Easting:400000,
                  Northing:4000000,
                  Zone:17
              }
          });

          Controller.viewModel.site({
              "zone":15,
              "xth":"300000",
              "yth":"3000000",
              "quad":"TEST",
              "site_id":1,
              "grid":"300",
              "trap_type":"Delta",
              "moth_count":0
          });

          view = new HomeView();

       });

       it("Can be instantiated", function() {
          expect(view).toBeDefined();
       });

       describe("Displays appropriate messages", function(){
          it("Shows no trap message", function(){
              view.site(testSites.unaddressed);
              expect(view.message().toEqual("No trap at this site!"));
          });
       });

       describe("Manual lock display", function() {
          it("Shows the lock icon when manual lock is enabled", function() {
             view.model.set('manualLock', false);
             view.model.set('manualLock', true);
              expect(view.$el.find('#lockDiv').css('visibility')).toEqual('visible');
          });

           it("Hides the lock icon when manual lock is disabled", function() {
               view.model.set('manualLock', true);
               view.model.set('manualLock', false);
               expect(view.$el.find('#lockDiv').css('visibility')).toEqual('hidden');
           });
       });

        describe("Inspection icon display and same day rule", function() {

            var initModel = function(site, distanceOutside) {
                var relativePosition = new RelativePosition({distanceOutside: distanceOutside});
                var nearestSite = new NearestSite({site: site, relativePosition: relativePosition});
                var nearestSites =  new NearestSiteCollection([nearestSite]);
                view.model = new CurrentPosition({currentUtm: {Easting: 300000, Northing: 3000000, Zone: 15}, nearestSites: nearestSites});
                view.model.set('selectedSite', nearestSite);
                view.render();
            };

            it("Shows the inspection icon when site has been inspected", function() {
                initModel(testSites.midseasonInspection, -1);
                expect(view.$el.find('#inspectDiv').css('visibility')).toEqual('visible');
            });

            it("Hides the inspection icon when site has not been inspected", function() {
                initModel(testSites.placedDelta, -1);
                expect(view.$el.find('#inspectDiv').css('visibility')).toEqual('hidden');
            });
        });

       describe("Determine operation based on site", function() {

            it("Returns ERROR when the quad value is equal to an empty string", function() {
                expect(view.getOperation({quad: '', site_id: ''})).toEqual('ERROR');
            });

            it("Returns UNADDRESSED for an unaddressed site", function() {
                expect(view.getOperation(testSites.unaddressed)).toEqual('UNADDRESSED');
            });

           it("Returns PLACED for a placed site", function() {
               expect(view.getOperation(testSites.placedDelta)).toEqual('PLACED');
               expect(view.getOperation(testSites.placedMilkCarton)).toEqual('PLACED');
           });

           it("Returns MIDSEASON for a midseason inspected site", function() {
               expect(view.getOperation(testSites.midseasonInspection)).toEqual('MIDSEASON');
           });

           it("Returns OMIT for an omitted site", function() {
              expect(view.getOperation(testSites.omit)).toEqual('OMITTED');
           });
       });

       describe("Operation and Target circles display", function() {

           var utm = {
               Easting: 300000,
               Northing: 3000000,
               Zone: 15
           };

           var colorToHex = function(color) {
               if (color.substr(0, 1) === '#') {
                   return color;
               }
               var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

               var red = parseInt(digits[2]);
               var green = parseInt(digits[3]);
               var blue = parseInt(digits[4]);

               var rgb = blue | (green << 8) | (red << 16);
               return digits[1] + '#' + rgb.toString(16).toUpperCase();
           };

           var initModel = function(site, distanceOutside) {
               var relativePosition = new RelativePosition({distanceOutside: distanceOutside});
               var nearestSite = new NearestSite({site: site, relativePosition: relativePosition});
               var nearestSites =  new NearestSiteCollection([nearestSite]);
               view.model = new CurrentPosition({currentUtm: utm, nearestSites: nearestSites});
               view.model.set('selectedSite', nearestSite);
               // To keep jasmine tests from failing on navigator.beep() call...
               if (distanceOutside > 0){
                   view.previousCircleStatus = true;
               }
               view.render();
           };

           var expectColorToMatchDistanceOutside = function(site, distanceOutside, color) {
               initModel(site, distanceOutside);
               var actualColor = colorToHex(view.$el.find('#siteDiv').css('background-color'));
               expect(actualColor).toEqual(color);
           };

           var expectImageToMatchOperation = function(site, distanceOutside, expectedImageSource) {
               initModel(site, distanceOutside);
               var imgSrc = view.$el.find('#homeImage').attr('src');
               expect(imgSrc).toEqual(expectedImageSource);
           };

           describe("Unaddressed", function() {
               var site = testSites.unaddressed;

               it("Shows green tree when we're within the target and the site is unaddressed", function() {
                   expectColorToMatchDistanceOutside(site, 0, '#799839');
                   expectColorToMatchDistanceOutside(site, -1, '#799839');
                   expectImageToMatchOperation(site, 0, 'img/greenTree.gif');
               });

               it("Shows red tree when we're outside the target and the site is unaddressed", function() {
                   expectColorToMatchDistanceOutside(site, 1, '#FF0000');
                   expectImageToMatchOperation(site, 1, 'img/redTree.gif');
               });
           });

           describe("Delta", function() {
               var site = testSites.placedDelta;

               it("Shows green delta when we're within the target and the site has a delta placement", function() {
                   expectColorToMatchDistanceOutside(site, 0, '#799839');
                   expectColorToMatchDistanceOutside(site, -1, '#799839');
                   expectImageToMatchOperation(site, 0, 'img/greenDelta.gif');
               });

               it("Shows red delta when we're outside the target and the site has a delta placement", function() {
                   expectColorToMatchDistanceOutside(site, 1, '#FF0000');
                   expectImageToMatchOperation(site, 1, 'img/redDelta.gif');
               });
           });

           describe("Milk Carton", function() {
               var site = testSites.placedMilkCarton;

               it("Shows green milk carton when we're within the target and the site has a milk carton placement", function() {
                   expectColorToMatchDistanceOutside(site, 0, '#799839');
                   expectColorToMatchDistanceOutside(site, -1, '#799839');
                   expectImageToMatchOperation(site, 0, 'img/greenMilkCarton.gif');
               });

               it("Shows red milk carton when we're outside the target and the site has a milk carton placement", function() {
                   expectColorToMatchDistanceOutside(site, 1, '#FF0000');
                   expectImageToMatchOperation(site, 1, 'img/redMilkCarton.gif');
               });
           });

           describe("Omit", function() {
              var site = testSites.omit;

              it("Shows omit when site is omitted", function() {
                 expectImageToMatchOperation(site, 0, 'img/omittedTree.gif');
              });
           });
       });
    }));
});