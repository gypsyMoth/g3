define(["jquery",
    "src/app",
    "src/models/CurrentPosition",
    'src/util/DB',
    "src/views/Confirm"
], function($, app, CurrentPosition, db, ConfirmView) {

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

        xit("Calls CurrentPosition.saveSites() when confirm is clicked", function() {
            spyOn(view.model, "saveSites");
            view.render();
            view.onOkClicked();
            expect(view.model.saveSites).toHaveBeenCalled();
        });

        describe("Saving data to filesystem", function() {

            app.SitesList = [
                {"zone":15,"xth":"329229","yth":"3475979","quad":"FIREP","site_id":1,"grid":"30","trap_type":"Milk Carton","moth_count":0},
                {"zone":15,"xth":"329180","yth":"3475941","quad":"DITCH","site_id":2,"grid":"30","trap_type":"Milk Carton","moth_count":0},
                {"zone":15,"xth":"528000","yth":"4176000","quad":"TEST","site_id":3,"grid":"8000","trap_type":"Milk Carton","moth_count":0}
            ];

            xit("Calls db.saveSites() when confirm is clicked", function(done) {
                spyOn(db, "saveSites");
                view.render();
                view.onOkClicked().then( function() {
                    expect(db.saveSites).toHaveBeenCalled();
                },
                function(error){
                    console.log(expect());
                    expect("initialize received error: " + error).toFail();
                })
                .always(done);
            });

            xit("Calls db.logOperation() when confirm is clicked", function() {
               spyOn(db, "logOperation");
                view.render();
                view.onOkClicked();
                expect(db.logOperation).toHaveBeenCalled();

            });

        });
    }));
});
