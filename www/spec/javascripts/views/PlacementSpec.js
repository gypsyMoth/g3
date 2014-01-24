/* Created by Ian on 1/24/14.*/
$(describe("Placement View", function() {

    var view;

    beforeEach(function() {
        loadFixtures('placement.html');
        $('body').append();
        view = new app.views.Placement({model: new app.models.CurrentPosition(), template: _.template($('#placement-template').html())});
    });

    it("Can be instantiated", function() {
        expect(view).toBeDefined();
    });

    it("Has a model", function() {
        expect(view.model).toBeDefined();
    });
}));