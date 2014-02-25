define(["jquery", "src/models/Splash", "src/views/Splash"], function($, SplashModel, SplashView) {
    $(describe("Splash View", function() {

        var view;

        beforeEach(function() {
            loadFixtures('splash.html');
            $('body').append();
            view = new SplashView({model: new SplashModel(), template: _.template($('#splash-template').html())});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a model", function() {
            expect(view.model).toBeDefined();
        });
    }));
});