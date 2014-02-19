/* Created by Ian on 1/23/14.*/

$(describe("Extras View", function() {
    var view;

    beforeEach(function() {
        loadFixtures('extras.html');
        $('body').append();
        view = new app.views.Extras({model: new app.models.CurrentPosition(), template: _.template($('#extras-template').html())});
    });

    it("Can be instantiated", function() {
        expect(view).toBeDefined();
    });

    it("Has a model", function() {
        expect(view.model).toBeDefined();
    });
}));
