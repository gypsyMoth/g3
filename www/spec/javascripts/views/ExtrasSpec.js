/* Created by Ian on 1/23/14.*/

$(describe("Extras View", function() {

    var model;
    var view;

    beforeEach(function() {
        loadFixtures('extras.html');
        $('body').append();
        model = new app.models.CurrentPosition();
        view = new app.views.Extras({model: model, template: _.template($('#extras-template').html())});
    });

    it("Can be instantiated", function() {
        expect(view).toBeDefined();
    });

    it("Has a model", function() {
        expect(view.model).toBeDefined();
    });
}));
