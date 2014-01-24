/* Created by Ian on 1/24/14.*/
$(describe("Placement View", function() {

    var view;

    beforeEach(function() {
        loadFixtures('placement.html');
        $('body').append();
        view = new app.views.Placement({model: new app.models.CurrentPosition(), template: _.template($('#placement-template').html())});
    });

    it("Can be instantiated", function() {
        expect(view).toBeDefined();
    });

    it("Has a model", function() {
        expect(view.model).toBeDefined();
    });

    describe("Updates the current operation", function() {

        it("Sets the operation values on startup", function() {
            var model = new app.models.CurrentPosition();
            model.set({currentUtm: {Easting: 123456, Northing: 1234567, Zone: 15}});
            model.set({site: {"zone":15,"xth":"329229","yth":"3475979","quad":"FIREP","site_id":1,"grid":"30","trap_type":"Delta","moth_count":0}});
            view = new app.views.Placement({model: model, template: _.template($('#placement-template').html())});
            var op = view.model.get('operation');
            expect(op.easting).toEqual(123456);
            expect(op.northing).toEqual(1234567);
            expect(op.traptype).toEqual('Delta');
            //expect(op.easting).toEqual(123456); //not sure how to test for current date
        });

        it("Updates the trap type when the select is changed", function() {
            var model = new app.models.CurrentPosition();
            model.set({currentUtm: {Easting: 123456, Northing: 1234567, Zone: 15}});
            model.set({site: {"zone":15,"xth":"329229","yth":"3475979","quad":"FIREP","site_id":1,"grid":"30","trap_type":"Delta","moth_count":0}});
            view = new app.views.Placement({model: model, template: _.template($('#placement-template').html())});
            $("#selectTraptype").val('0'); //doesn't work!?
            //$("#selectTraptype option[value='1']").attr("selected","selected");
            var op = view.model.get('operation');
            expect(op.traptype).toEqual('Milk Carton');
        });
    });
}));