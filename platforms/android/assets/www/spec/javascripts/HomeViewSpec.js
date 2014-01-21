/**
 * Created by Ian on 1/21/14.
 */
$(describe("Home View tests", function() {

   beforeEach(function() {
      loadFixtures('home.html');
      $('body').append();
      this.view = new app.views.Home({model: new app.models.CurrentPosition()});
   });

   it("Can instantiate the view", function() {
      expect(this.view).toBeDefined();
   });
}));