define(["jquery",
    "src/models/CurrentPosition",
    "src/views/Random"],
    function($, CurrentPosition, RandomView) {'use strict';

        $(describe("Random View", function() {

            var view;

            beforeEach(function() {
                view = new RandomView({model: new CurrentPosition()});
            });

            it("Can be instantiated", function() {
                expect(view).toBeDefined();
            });

            it("Has a model", function() {
                expect(view.model).toBeDefined();
            });
        }));
    });