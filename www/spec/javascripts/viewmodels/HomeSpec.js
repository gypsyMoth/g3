define(["jquery",
    "underscore",
    "src/util/Controller",
    "src/viewmodels/Home"
], function($, _, Controller, HomeView) { 'use strict';

    $(describe("Home View", function() {

        var Gadget = Controller.gadget;
        var home;

        var testSites = {
            unaddressed: {
                "zone": 15,
                "xth": "300000",
                "yth": "3000000",
                "xact": null,
                "yact": null,
                "quad": "TEST",
                "site_id": 1,
                "grid": "300",
                "trap_type": "Delta",
                "moth_count": 0,
                "visit": null,
                "omit_reason": null,
                "condition": null,
                "txn_date": null
            },
            placedDelta: {
                "zone": 15,
                "xth": "300000",
                "yth": "3000000",
                "xact": 400000,
                "yact": 4000000,
                "quad": "TEST",
                "site_id": 1,
                "grid": "300",
                "trap_type": "Delta",
                "moth_count": 0,
                "visit": null,
                "omit_reason": null,
                "condition": null,
                "txn_date": "2013-02-06T00:00:00-00:00"
            },
            omit: {
                "zone": 15,
                "xth": "300000",
                "yth": "3000000",
                "xact": 400000,
                "yact": 4000000,
                "quad": "TEST",
                "site_id": 1,
                "grid": "300",
                "trap_type": "Omit",
                "moth_count": 0,
                "visit": null,
                "omit_reason": "Landowner denied access",
                "condition": null,
                "txn_date": "2013-02-06T00:00:00-00:00"

            },
            placedMilkCarton: {
                "zone": 15,
                "xth": "300000",
                "yth": "3000000",
                "xact": 400000,
                "yact": 4000000,
                "quad": "TEST",
                "site_id": 1,
                "grid": "300",
                "trap_type": "Milk Carton",
                "moth_count": 0,
                "visit": null,
                "omit_reason": null,
                "condition": null,
                "txn_date": "2013-02-06T00:00:00-00:00"
            },
            midseasonInspection: {
                "zone": 17,
                "xth": "700028",
                "yth": "4141028",
                "xact": "700028",
                "yact": "4141028",
                "quad": "HOLID",
                "site_id": 9009,
                "grid": "9999",
                "trap_type": "Milk Carton",
                "visit": "MIDSEASON",
                "condition": "GOOD",
                "moth_count": 0,
                "omit_reason": null,
                "txn_date": "2013-02-06T00:00:00-00:00"
            },
            finalInspection: {
                "zone": 17,
                "xth": "700028",
                "yth": "4141028",
                "xact": "700028",
                "yact": "4141028",
                "quad": "HOLID",
                "site_id": 9009,
                "grid": "9999",
                "trap_type": "Milk Carton",
                "visit": "FINAL",
                "condition": "GOOD",
                "moth_count": 0,
                "omit_reason": null,
                "txn_date": "2013-02-06T00:00:00-00:00"
            },
            QCInspection: {
                "zone": 17,
                "xth": "700028",
                "yth": "4141028",
                "xact": "700028",
                "yact": "4141028",
                "quad": "HOLID",
                "site_id": 9009,
                "grid": "9999",
                "trap_type": "Milk Carton",
                "visit": "MIDSEASON",
                "condition": "GOOD",
                "moth_count": 0,
                "omit_reason": null,
                "fail_reason": "Trap hung too low",
                "txn_date": "2013-02-06T00:00:00-00:00"
            }
        };

        beforeEach(function() {
            home = new HomeView();
        });

        it("Displays tree", function() {
            Controller.gadget.selectedSite(testSites.unaddressed);
            expect(home.imageType()).toEqual("Tree");
        });

        it("Displays milk carton", function() {
            Controller.gadget.selectedSite(testSites.placedMilkCarton);
            expect(home.imageType()).toEqual("MilkCarton");
        });

        it("Displays delta", function() {
            Controller.gadget.selectedSite(testSites.placedDelta);
            expect(home.imageType()).toEqual("Delta");
        });

        it("Displays no message if no site is found", function() {
            Controller.gadget.selectedSite({});
            expect(home.message()).toEqual("");
        });

        it("Displays no trap at site message", function() {
            Controller.gadget.selectedSite(testSites.unaddressed);
            expect(home.message()).toEqual("No trap at this site!");
        });

        it("Displays omit message", function() {
            Controller.gadget.selectedSite(testSites.omit);
            expect(home.message()).toEqual("This trap was omitted on 2\u20116\u201113");
        });

        it("Displays placed message", function() {
            Controller.gadget.selectedSite(testSites.placedDelta);
            expect(home.message()).toEqual("This trap was placed on 2\u20116\u201113");
        });

        it("Displays QC message", function() {
            Controller.gadget.selectedSite(testSites.QCInspection);
            expect(home.message()).toEqual("A QC Inspection was done for this trap on 2\u20116\u201113");
        });

        it("Displays midseason message", function() {
            Controller.gadget.selectedSite(testSites.midseasonInspection);
            expect(home.message()).toEqual("A MIDSEASON Inspection was done for this trap on 2\u20116\u201113");
        });

        it("Displays final message", function() {
            Controller.gadget.selectedSite(testSites.finalInspection);
            expect(home.message()).toEqual("A FINAL Inspection was done for this trap on 2\u20116\u201113");
        });

        it("Sets operation type to error", function() {
            Controller.gadget.selectedSite({});
            expect(home.operationType()).toEqual("ERROR");
        });

        it("Sets operation type to omitted", function() {
            Controller.gadget.selectedSite(testSites.omit);
            expect(home.operationType()).toEqual("OMITTED");
        });

        it("Sets operation type to placed", function() {
            Controller.gadget.selectedSite(testSites.placedDelta);
            expect(home.operationType()).toEqual("PLACED");
        });

        it("Sets operation type to unaddressed", function() {
            Controller.gadget.selectedSite(testSites.unaddressed);
            expect(home.operationType()).toEqual("UNADDRESSED");
        });

        it("Sets operation type to midseason", function() {
            Controller.gadget.selectedSite(testSites.midseasonInspection);
            expect(home.operationType()).toEqual("MIDSEASON");
        });

        it("Sets operation type to final", function() {
            Controller.gadget.selectedSite(testSites.finalInspection);
            expect(home.operationType()).toEqual("FINAL");
        });

        it("Sets color to red outside target circle", function() {
            home.isOut(true);
            expect(home.color()).toEqual("red");
        });

        it("Sets color to green inside target circle", function() {
            home.isOut(false);
            expect(home.color()).toEqual("green");
        });

    }))
});
