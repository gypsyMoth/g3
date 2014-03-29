define(["jquery",
    "underscore",
    "src/models/CurrentPosition",
    "src/views/Omit"],
    function($, _, CurrentPosition, OmitView) { 'use strict';
    $(describe("Omit View", function() {
        var view;

        beforeEach(function() {
            loadFixtures('omit.html');
            $('body').append();
            view = new OmitView({model: new CurrentPosition(), template: _.template($('#omit-template').html())});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a model", function() {
            expect(view.model).toBeDefined();
        });

        it("Defaults with a selected omit reason", function() {
           var view = new OmitView({model: new CurrentPosition(), template: _.template($('#omit-template').html())});
           expect(view.model.get('operation').omitReason).toEqual("Nothing to hang trap on");
        });


//        it("Sets the operation traptype when an omit reason is selected", function() {
//            var model = new CurrentPosition();
//            model.set({currentUtm: {Easting: 123456, Northing: 1234567, Zone: 15}});
//            model.set({site: {"zone":15,"xth":"329229","yth":"3475979","quad":"FIREP","site_id":1,"grid":"30","trap_type":"Delta","moth_count":0}});
//            view = new OmitView({model: model, template: _.template(omitTemplate)});
//            view.render();
//            //$("#selectTraptype").val('1'); //doesn't work!?
//            //$("#selectTraptype").prop('selectedIndex', 1);
//            var select = $('#selectOmitReason');
//            select.trigger('change');
//            var ok = $('#btnOmitOk');
//            ok.click();
//            var op = view.model.get('operation');
//            expect(op.traptype).toEqual('L');
//        });
    }));
});
