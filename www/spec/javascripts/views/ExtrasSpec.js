define(["jquery", "src/app", "src/models/CurrentPosition", "src/views/Extras"], function($, app, CurrentPosition, ExtrasView) {
    $(describe("Extras View", function() {
        var view;

        beforeEach(function() {
            loadFixtures('extras.html');
            $('body').append();
            view = new ExtrasView({model: new CurrentPosition(), template: _.template($('#extras-template').html())});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a model", function() {
            expect(view.model).toBeDefined();
        });
    }));
});
