define(['src/util/Encoder',
        'src/util/Date',
        'src/util/NearestNeighbor',
        'src/viewmodels/Gadget',
        'src/util/Controller'],
    function(encoder,
             DateFormatter,
             NearestNeighbor,
             GadgetView,
             Controller
    ) {

    'use strict';

    var gadget, op;

    describe("Encoder Module", function() {
       it("Has a method that returns an encoded string", function() {
          expect(encoder.codedString).toBeDefined();
       });

       it("Pads site ids correctly", function() {
           expect(encoder.padSite(9)).toEqual('0009');
           expect(encoder.padSite(90)).toEqual('0090');
           expect(encoder.padSite(900)).toEqual('0900');
           expect(encoder.padSite(9000)).toEqual('9000');
       });

        it("Pads catch correctly", function() {
            expect(encoder.padCatch(9)).toEqual('009');
            expect(encoder.padCatch(90)).toEqual('090');
            expect(encoder.padCatch(900)).toEqual('900');
        });

       it("Pads quad abbreviations correctly", function() {
           expect(encoder.padQuad('R')).toEqual('R    ');
           expect(encoder.padQuad('RA')).toEqual('RA   ');
           expect(encoder.padQuad('RAN')).toEqual('RAN  ');
           expect(encoder.padQuad('RAND')).toEqual('RAND ');
           expect(encoder.padQuad('RANDM')).toEqual('RANDM');
       });

        describe("Builds coded string properly", function(){

            var testSites = {
                placedDelta: {
                    "zone":17,
                    "xth":"300000",
                    "yth":"3000000",
                    "xact": 400000,
                    "yact": 4000000,
                    "quad":"TEST",
                    "site_id":1,
                    "grid":"300",
                    "trap_type":"Delta",
                    "moth_count":0,
                    "txn_date":"2013-02-06T00:00:00-00:00"
                },
                placedMilkCarton: {
                    "zone":17,
                    "xth":"300000",
                    "yth":"3000000",
                    "xact": 400000,
                    "yact": 4000000,
                    "quad":"TEST",
                    "site_id":1,
                    "grid":"300",
                    "trap_type":"Milk Carton",
                    "moth_count":0,
                    "txn_date":"2013-02-06T00:00:00-00:00"
                },
                midseasonInspection: {
                    "zone":17,
                    "xth":"700028",
                    "yth":"4141028",
                    "xact":"700028",
                    "yact":"4141028",
                    "quad":"HOLID",
                    "site_id":9009,
                    "grid":"9999",
                    "trap_type":"Milk Carton",
                    "visit":"MIDSEASON",
                    "condition":"GOOD",
                    "moth_count":0,
                    "txn_date":"2013-02-06T00:00:00-00:00"
                },
                finalInspection: {
                    "zone":17,
                    "xth":"700028",
                    "yth":"4141028",
                    "xact":"700028",
                    "yact":"4141028",
                    "quad":"HOLID",
                    "site_id":10,
                    "grid":"9999",
                    "trap_type":"Milk Carton",
                    "visit":"FINAL",
                    "condition":"DAMAGED",
                    "moth_count":25,
                    "txn_date":"2013-02-06T00:00:00-00:00"
                },
                qcMissingInspection: {
                    "zone":17,
                    "xth":"700028",
                    "yth":"4141028",
                    "xact":"700028",
                    "yact":"4141028",
                    "quad":"HOLID",
                    "site_id":9009,
                    "grid":"9999",
                    "trap_type":"Milk Carton",
                    "visit":"MIDSEASON",
                    "condition":"MISSING",
                    "moth_count":0,
                    "txn_date":"2013-02-06T00:00:00-00:00",
                    "passFail":"Failed",
                    "fail_reason":"Record filled out, no trap set"
                },
                qcPassInspection: {
                    "zone":17,
                    "xth":"700028",
                    "yth":"4141028",
                    "xact":"700028",
                    "yact":"4141028",
                    "quad":"HOLID",
                    "site_id":123,
                    "grid":"9999",
                    "trap_type":"Milk Carton",
                    "visit":"MIDSEASON",
                    "condition":"GOOD",
                    "moth_count":0,
                    "txn_date":"2013-02-06T00:00:00-00:00",
                    "passFail":"Passed",
                    "fail_reason":"Passed"
                },
                omit: {
                    "zone":17,
                    "xth":"300000",
                    "yth":"3000000",
                    "xact": 400000,
                    "yact": 4000000,
                    "quad":"TEST",
                    "site_id":1,
                    "grid":"300",
                    "trap_type":"Omit",
                    "omit_code":"H",
                    "omit_reason":"No structure on which to hang trap",
                    "moth_count":0,
                    "txn_date":"2013-02-06T00:00:00-00:00"
                }
            };

            beforeEach(function() {
                Controller.gadget = new GadgetView();
                gadget = Controller.gadget;
                gadget.initialize();
                gadget.position().latitude(36.141462);
                gadget.position().longitude(-82.11132);
                gadget.position().accuracy(10);
                op = gadget.operationalSite();

            });

            var initModel = function(site, distanceOutside) {

                gadget.relativePosition({distanceOutside: distanceOutside});

                op.site_id = site.site_id;
                op.quad = site.quad;
                op.zone = gadget.position().utm().Zone; //17;
                op.xact = gadget.position().utm().Easting; //400000;
                op.yact = gadget.position().utm().Northing; //4000000;
                op.visit = site.visit;
                op.condition = site.condition;
                op.moth_count = site.moth_count;
                //op.passFail = site.pass_fail;
                op.fail_reason = site.fail_reason;
                op.trap_type = site.trap_type;
                op.omit_reason = site.omit_reason;
                op.txn_date = site.txn_date;
            };

            function setCompString(date, code){
                var ret = "#,000,01234567890123,17,North,400000,4000000,10.00,";
                ret += DateFormatter.getOperationFormatDate(date) + ",";
                ret += DateFormatter.getOperationFormatTime(date);
                ret += ",,0,";
                ret += code + ",$\r\n";
                return ret;
            };

            it("Codes delta placement in target circle", function(){
                initModel(testSites.placedDelta, 0);
                var codeString = encoder.codedString(gadget.operationalSite());
                var compString = setCompString(gadget.operationalSite().txn_date, "TEST 0001D");
                expect(codeString).toEqual(compString);
            });

            it("Codes milk carton placement outside target circle", function(){
                initModel(testSites.placedMilkCarton, 1);
                var codeString = encoder.codedString(gadget.operationalSite());
                var compString = setCompString(gadget.operationalSite().txn_date, "TEST 0001MB");
                expect(codeString).toEqual(compString);
            });

            it("Codes omit", function(){
                initModel(testSites.omit, -1);
                var codeString = encoder.codedString(gadget.operationalSite());
                var compString = setCompString(gadget.operationalSite().txn_date, "TEST 0001OH");
                expect(codeString).toEqual(compString);
            });

            it("Codes midseason good inspection with 0 moths", function(){
                initModel(testSites.midseasonInspection, 0);
                var codeString = encoder.codedString(gadget.operationalSite());
                var compString = setCompString(gadget.operationalSite().txn_date, "HOLID9009MG000");
                expect(codeString).toEqual(compString);
            });

            it("Codes final damaged inspection with 25 moths", function(){
                initModel(testSites.finalInspection, 0);
                var codeString = encoder.codedString(gadget.operationalSite());
                var compString = setCompString(gadget.operationalSite().txn_date, "HOLID0010FD025");
                expect(codeString).toEqual(compString);
            });

            it("Codes failed missing qc inspection", function(){
                initModel(testSites.qcMissingInspection, 0);
                var codeString = encoder.codedString(gadget.operationalSite());
                var compString = setCompString(gadget.operationalSite().txn_date, "HOLID9009MM FR");
                expect(codeString).toEqual(compString);
            });

            it("Codes passed good qc inspection", function(){
                initModel(testSites.qcPassInspection, 0);
                var codeString = encoder.codedString(gadget.operationalSite());
                var compString = setCompString(gadget.operationalSite().txn_date, "HOLID0123MG0P");
                expect(codeString).toEqual(compString);
            });

        });

    });
});