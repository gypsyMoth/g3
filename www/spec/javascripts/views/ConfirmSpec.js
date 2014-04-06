define(["jquery",
    'underscore',
    "src/models/CurrentPosition",
    'src/util/DB',
    'src/models/NearestSite',
    "src/views/Confirm"
], function($, _, CurrentPosition, db, NearestSite, ConfirmView) { 'use strict';

    $(describe("Confirm View", function() {

        var view;

        beforeEach(function() {
            view = new ConfirmView({model: new CurrentPosition()});
            view.model.nearestSites.add(new NearestSite());
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
            view.model.manualLock = true;
            view.render();
            view.onOkClicked();
            expect(view.model.manualLock).toBeFalsy();
        });
    }));
});
