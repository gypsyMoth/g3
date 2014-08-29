define(["jquery",
    'underscore',
    "src/models/CurrentPosition",
    "src/models/RelativePosition",
    'src/util/DB',
    'src/util/Date',
    'src/models/NearestSite',
    "src/views/Confirm"
], function($, _, CurrentPosition, RelativePosition, db, DateFormatter, NearestSite, ConfirmView) { 'use strict';

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
            view.model.set('manualLock', true);
            view.render();
            view.onOkClicked();
            expect(view.model.get('manualLock')).toBeFalsy();
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
                    "failReason":"Record filled out, no trap set (bogus data)"
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
                    "failReason":"Passed"
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
                    "omit_reason":"Nothing to hang trap on",
                    "moth_count":0,
                    "txn_date":"2013-02-06T00:00:00-00:00"
                }
            };

            var utm = {
                Easting: 400000,
                Northing: 4000000,
                Zone: 17
            };

            var initModel = function(site, distanceOutside) {
                var relativePosition = new RelativePosition({distanceOutside: distanceOutside});
                var nearestSite = new NearestSite({site: site, relativePosition: relativePosition});
                view.model = new CurrentPosition({currentUtm: utm});
                view.model.set('selectedSite', nearestSite);
                var op = view.model.get('operation');
                op.zone = view.model.get('currentUtm').Zone;
                op.easting = view.model.get('currentUtm').Easting;
                op.northing = view.model.get('currentUtm').Northing;
                op.accuracy = 10;
                op.visit = site.visit;
                op.condition = site.condition;
                op.catch = site.moth_count;
                op.passFail = site.passFail;
                op.failReason = site.failReason;
                op.traptype = site.trap_type;
                op.omitReason = site.omit_reason;
                op.omitCode = site.omit_code;
                op.date = Date.now();
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
                var codeString = view.model.codedString();
                var compString = setCompString(view.model.get('operation').date, "TEST 0001D");
                expect(codeString).toEqual(compString);
            });

            it("Codes milk carton placement outside target circle", function(){
                initModel(testSites.placedMilkCarton, 1);
                var codeString = view.model.codedString();
                var compString = setCompString(view.model.get('operation').date, "TEST 0001MB");
                expect(codeString).toEqual(compString);
            });

            it("Codes omit", function(){
                initModel(testSites.omit, -1);
                var codeString = view.model.codedString();
                var compString = setCompString(view.model.get('operation').date, "TEST 0001OH");
                expect(codeString).toEqual(compString);
            });

            it("Codes midseason good inspection with 0 moths", function(){
                initModel(testSites.midseasonInspection, 0);
                var codeString = view.model.codedString();
                var compString = setCompString(view.model.get('operation').date, "HOLID9009MG000");
                expect(codeString).toEqual(compString);
            });

            it("Codes final damaged inspection with 25 moths", function(){
                initModel(testSites.finalInspection, 0);
                var codeString = view.model.codedString();
                var compString = setCompString(view.model.get('operation').date, "HOLID0010FD025");
                expect(codeString).toEqual(compString);
            });

            it("Codes failed missing qc inspection", function(){
                initModel(testSites.qcMissingInspection, 0);
                var codeString = view.model.codedString();
                var compString = setCompString(view.model.get('operation').date, "HOLID9009MM FR");
                expect(codeString).toEqual(compString);
            });

            it("Codes passed good qc inspection", function(){
                initModel(testSites.qcPassInspection, 0);
                var codeString = view.model.codedString();
                var compString = setCompString(view.model.get('operation').date, "HOLID0123MG0P");
                expect(codeString).toEqual(compString);
            });

        });


    }));
});
