/**
 * Created by Ian on 1/21/14.
 */
$(describe("Home View tests", function() {

   var model;
   var view;

   beforeEach(function() {
      loadFixtures('home.html');
      $('body').append();
      model = new app.models.CurrentPosition();
      view = new app.views.Home({model: model, template: _.template($('#home-template').html())});
   });

   it("Can be instantiated", function() {
      expect(view).toBeDefined();
   });

   it("Has a model", function() {
       expect(view.model).toBeDefined();
   });

   describe("Target Circle Tests", function() {
        var sites = [
           {"zone":15,"xth":"300000","yth":"3000000","quad":"TEST","site_id":1,"grid":"300","trap_type":"Delta","moth_count":0},
        ];

        var loadPoint = function(longitude, latitude, accuracy) {
          var p = app.CoordinateConverter.datumShift({ Lon: longitude, Lat: latitude});
          var utm = app.CoordinateConverter.project(p);
          model.set({currentLatLon: {
              Latitude: latitude,
              Longitude: longitude,
              Accuracy: accuracy
          }});
          model.set({currentUtm: utm});
          model.set({nearestSite: app.Sites.Nearest(utm, app.SitesList)});
        };

       //this.model.set({nearestSite: app.Sites.Nearest(utm, app.SitesList)});
       var utm = {
           Easting: 300000,
           Northing: 3000000,
           Zone: 15
       };

       var testSite = {
           Site: sites[0],
           Distance: 100,
           Bearing: 'N',
           DistanceOutside: 0,
           Found: true
       };

       it("Shows green when we're within the target", function() {
           loadPoint();
           testSite.DistanceOutside = 0;
           model.set({currentUtm: utm});
           model.set({nearestSite: testSite});
           var v = view.render().checkTargetCircle();
           expect($(v).find('#siteDiv').css('background-color')).toEqual('#799839');
       });
   });
}));