define(["jquery",
    'underscore',
    "src/models/CurrentPosition",
    "src/views/Placement"
], function($, _, CurrentPosition, PlacementView) { "use strict";
    $(describe("Placement View", function() {

        var view;

        beforeEach(function() {
            loadFixtures('placement.html');
            $('body').append();
            view = new PlacementView({model: new CurrentPosition(), template: _.template($('#placement-template').html())});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a model", function() {
            expect(view.model).toBeDefined();
        });

        describe("Updates the current operation", function() {

            it("Sets the operation values on startup", function() {
                var model = new CurrentPosition();
                model.set({currentUtm: {Easting: 123456, Northing: 1234567, Zone: 15}});
                model.get('selectedSite').set({site: {"zone":15,"xth":"329229","yth":"3475979","quad":"FIREP","site_id":1,"grid":"30","trap_type":"Delta","moth_count":0}});
                view = new PlacementView({model: model, template: _.template($('#placement-template').html())});
                var op = view.model.get('operation');
                expect(op.easting).toEqual(123456);
                expect(op.northing).toEqual(1234567);
                expect(op.traptype).toEqual('Delta');
            });

//            it("Updates the operation trap type when the select is changed", function() {
//                var model = new CurrentPosition();
//                model.set({currentUtm: {Easting: 123456, Northing: 1234567, Zone: 15}});
//                model.set({site: {"zone":15,"xth":"329229","yth":"3475979","quad":"FIREP","site_id":1,"grid":"30","trap_type":"Delta","moth_count":0}});
//                view = new PlacementView({model: model, template: _.template($('#placement-template').html())});
//                view.render();
//                //$("#selectTraptype").val('1'); //doesn't work!?
//                //$("#selectTraptype").prop('selectedIndex', 1);
//                $('#selectTraptype').trigger('change');
//                var op = view.model.get('operation');
//                expect(op.traptype).toEqual('Milk Carton');
//            });
        });
    }));
});