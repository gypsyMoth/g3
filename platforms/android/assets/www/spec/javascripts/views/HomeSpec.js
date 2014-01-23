/**
 * Created by Ian on 1/21/14.
 */
$(describe("Home View", function() {

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

       var colorToHex = function(color) {
           if (color.substr(0, 1) === '#') {
               return color;
           }
           var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

           var red = parseInt(digits[2]);
           var green = parseInt(digits[3]);
           var blue = parseInt(digits[4]);

           var rgb = blue | (green << 8) | (red << 16);
           return digits[1] + '#' + rgb.toString(16);
       };

       it("Shows green when we're within the target", function() {
           testSite.DistanceOutside = 0;
           model.set({currentUtm: utm});
           model.set({nearestSite: testSite});
           view.render();
           var actualColor = colorToHex(view.$el.find('#siteDiv').css('background-color'));
           expect(actualColor).toEqual('#799839');
       });

       it("Shows red when we're outside the target", function() {
           testSite.DistanceOutside = 1;
           model.set({currentUtm: utm});
           model.set({nearestSite: testSite});
           view.render();
           var actualColor = (view.$el.find('#siteDiv').css('background-color'));
           expect(actualColor).toEqual('red');
       });
   });
}));