define(["jquery",
    'underscore',
    "src/app",
    "src/models/CurrentPosition",
    'src/util/DB',
    'src/util/Geolocation',
    "src/views/Confirm"
], function($, _, app, CurrentPosition, db, Geolocation, ConfirmView) {

    $(describe("Confirm View", function() {

        var view;

        beforeEach(function() {
            loadFixtures('confirm.html');
            $('body').append();
            view = new ConfirmView({model: new CurrentPosition(), template: _.template($('#confirm-template').html())});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a model", function() {
            expect(view.model).toBeDefined();
        });

        it("Calls CurrentPosition.saveSites() when confirm is clicked", function() {
            spyOn(view.model, "saveSites");
            view.render();
            view.onOkClicked();
            expect(view.model.saveSites).toHaveBeenCalled();
        });

        it("Sets manual lock to false on confirm", function() {
            Geolocation.manualLock = true;
            view.render();
            view.onOkClicked();
            expect(Geolocation.manualLock).toBeFalsy();
        });
    }));
});
