define(["jquery",
    "underscore",
    "src/models/CurrentPosition",
    "src/views/Inspection"],
    function($, _, CurrentPosition, InspectionView) { 'use strict';
    $(describe("Inspection View", function() {
        var view;

        beforeEach(function() {
            view = new InspectionView({model: new CurrentPosition()});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a model", function() {
            expect(view.model).toBeDefined();
        });

        it("Sets default count to zero", function(){
            var op = view.model.get('operation');
            expect(op.catch).toEqual(0);
        });

        it("Resets catch to zero", function(){
            var op = view.model.get('operation');
            op.catch = 999;
            view.resetCatch();
            expect(op.catch).toEqual(0);
        });

        it("Catches invalid moth count", function(){
            var op = view.model.get('operation');
            op.catch = -1;
            view.onOkClicked();
            expect(op.catch).toEqual(0);
        });

        it("Updates message", function(){
            var op = view.model.get('operation');
            op.visit = "FINAL";
            var message = op.visit + " inspection of " + op.condition + " trap with " + op.catch + " moths.";
            expect(message).toEqual("FINAL inspection of GOOD trap with 0 moths.");
        });

    }));
});
