/* Created by Ian on 1/24/14.*/
$(describe("Caution View", function() {

    var view;

    beforeEach(function() {
        loadFixtures('caution.html');
        $('body').append();
        view = new app.views.Caution({model: new app.models.CurrentPosition(), template: _.template($('#caution-template').html())});
    });

    it("Can be instantiated", function() {
        expect(view).toBeDefined();
    });

    it("Has a model", function() {
        expect(view.model).toBeDefined();
    });
}));