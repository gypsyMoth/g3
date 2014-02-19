/* Created by Ian on 1/24/14.*/
$(describe("Splash View", function() {

    var view;

    beforeEach(function() {
        loadFixtures('splash.html');
        $('body').append();
        view = new app.views.Splash({model: new app.models.Splash(), template: _.template($('#splash-template').html())});
    });

    it("Can be instantiated", function() {
        expect(view).toBeDefined();
    });

    it("Has a model", function() {
        expect(view.model).toBeDefined();
    });
}));