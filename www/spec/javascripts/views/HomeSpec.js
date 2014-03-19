define(["jquery",
    "underscore",
    "src/models/CurrentPosition",
    "src/models/RelativePosition",
    "src/models/NearestSite",
    "src/collections/NearestSiteCollection",
    "src/views/Home"
], function($, _, CurrentPosition, RelativePosition, NearestSite, NearestSiteCollection, HomeView) { 'use strict';

    $(describe("Home View", function() {
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
            }
        };

       beforeEach(function() {
          loadFixtures('home.html');
          $('body').append();
          view = new HomeView({model: new CurrentPosition(), template: _.template($('#home-template').html())});
       });

       it("Can be instantiated", function() {
          expect(view).toBeDefined();
       });

       it("Has a model", function() {
           expect(view.model).toBeDefined();
       });

       it("Clears the operation on initial load", function() {
           view.model.set({operation: {easting: 123456, northing: 1234567, date: '01/01/14', traptype: 'Delta'}});
           view = new HomeView({model: new CurrentPosition(), template: _.template($('#home-template').html())});
           var op = view.model.get('operation');
           expect(op).toEqual({easting: '', northing: '', zone: '', date: '', traptype: ''});
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
               expect(view.getOperation(testSites.placedDelta)).toEqual('PLACED');
           });

           it("Returns MIDSEASON for a midseason inspected site", function() {
               expect(view.getOperation(testSites.midseasonInspection)).toEqual('MIDSEASON');
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
       });
    }));
});