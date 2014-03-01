define(["jquery", "src/app", "src/models/CurrentPosition", "src/views/Caution"], function($, app, CurrentPosition, CautionView) {

    $(describe("Caution View", function() {

        var view;

        beforeEach(function() {
            loadFixtures('caution.html');
            $('body').append();
            view = new CautionView({model: new CurrentPosition(), template: _.template($('#caution-template').html())});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a model", function() {
            expect(view.model).toBeDefined();
        });
    }));
});