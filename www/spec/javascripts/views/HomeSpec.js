/**
 * Created by Ian on 1/21/14.
 */
$(describe("Home View", function() {
   var view;

   beforeEach(function() {
      loadFixtures('home.html');
      $('body').append();
      view = new app.views.Home({model: new app.models.CurrentPosition(), template: _.template($('#home-template').html())});
   });

   it("Can be instantiated", function() {
      expect(view).toBeDefined();
   });

   it("Has a model", function() {
       expect(view.model).toBeDefined();
   });

   it("Clears the operation on initial load", function() {
       view.model.set({operation: {easting: 123456, northing: 1234567, date: '01/01/14', traptype: 'Delta'}});
       view = new app.views.Home({model: new app.models.CurrentPosition(), template: _.template($('#home-template').html())});
       var op = view.model.get('operation');
       expect(op).toEqual({easting: '', northing: '', date: '', traptype: ''});
   })

   describe("Target Circle Tests", function() {
        var site = {
           "zone":15,
           "xth":"300000",
           "yth":"3000000",
           "quad":"TEST",
           "site_id":1,
           "grid":"300",
           "trap_type":"Delta",
           "moth_count":0
       };

       var utm = {
           Easting: 300000,
           Northing: 3000000,
           Zone: 15
       };

       var relativePosition = {
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
           return digits[1] + '#' + rgb.toString(16).toUpperCase();
       };

       var expectColorToMatchDistanceOutside = function(distanceOutside, color) {
           relativePosition.DistanceOutside = distanceOutside;
           view.model.set({currentUtm: utm});
           view.model.set({site: site});
           view.model.set({relativePosition: relativePosition});
           view.render();
           var actualColor = colorToHex(view.$el.find('#siteDiv').css('background-color'));
           expect(actualColor).toEqual(color);
       };

       it("Shows green when we're within the target", function() {
            expectColorToMatchDistanceOutside(0, '#799839');
           expectColorToMatchDistanceOutside(-1, '#799839');
       });

       it("Shows red when we're outside the target", function() {
           expectColorToMatchDistanceOutside(1, '#FF0000');
       });
   });
}));