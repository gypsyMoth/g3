define(["jquery",
    'underscore',
    "src/models/CurrentPosition",
    "src/views/Placement"
], function($, _, CurrentPosition, PlacementView) { "use strict";
    $(describe("Placement View", function() {

        var view;

        beforeEach(function() {
            view = new PlacementView({model: new CurrentPosition()});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a model", function() {
            expect(view.model).toBeDefined();
        });

        it("Doesn't allow omits for random traps", function() {
            var model = new CurrentPosition();
            model.set({currentUtm: {Easting: 123456, Northing: 1234567, Zone: 15}});
            model.get('selectedSite').set({site: {"zone":15,"xth":"329229","yth":"3475979","quad":"RANDM","site_id":9000,"grid":"30","trap_type":"Delta","moth_count":0}});
            view = new PlacementView({model: model});
            $('#btnPlacementOmit').enabled

        });

        describe("Updates the current operation", function() {

            it("Sets the operation values on startup", function() {
                var model = new CurrentPosition();
                model.set({currentUtm: {Easting: 123456, Northing: 1234567, Zone: 15}});
                model.get('selectedSite').set({site: {"zone":15,"xth":"329229","yth":"3475979","quad":"FIREP","site_id":1,"grid":"30","trap_type":"Delta","moth_count":0}});
                view = new PlacementView({model: model});
                var op = view.model.get('operation');
                expect(op.easting).toEqual(123456);
                expect(op.northing).toEqual(1234567);
                expect(op.traptype).toEqual('Delta');
            });
        });
    }));
});