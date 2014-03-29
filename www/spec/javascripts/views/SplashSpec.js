define(["jquery",
    "src/models/Splash",
    "src/views/Splash"],
    function($, SplashModel, SplashView) { 'use strict';
    $(describe("Splash View", function() {

        var view;

        beforeEach(function() {
            view = new SplashView({model: new SplashModel()});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a model", function() {
            expect(view.model).toBeDefined();
        });
    }));
});