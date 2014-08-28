define(["jquery",
    "src/models/CurrentPosition",
    "src/views/Extras"],
    function($, CurrentPosition, ExtrasView) { 'use strict';
    $(describe("Extras View", function() {
        var view;

        beforeEach(function() {
            view = new ExtrasView({model: new CurrentPosition()});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a model", function() {
            expect(view.model).toBeDefined();
        });
    }));
});
