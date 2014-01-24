/* Created by Ian on 1/24/14.*/
$(describe("Confirm View", function() {

    var view;

    beforeEach(function() {
        loadFixtures('confirm.html');
        $('body').append();
        view = new app.views.Confirm({model: new app.models.CurrentPosition(), template: _.template($('#confirm-template').html())});
    });

    it("Can be instantiated", function() {
        expect(view).toBeDefined();
    });

    it("Has a model", function() {
        expect(view.model).toBeDefined();
    });
}));
