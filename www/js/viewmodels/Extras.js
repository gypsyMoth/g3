define(['jquery',
    'knockout',
    'src/util/DB',
    'src/util/Date',
    'src/util/Controller',
    'src/viewmodels/History'
], function($,
            ko,
            DB,
            DateFormatter,
            Controller,
            HistoryView
    ) {

    'use strict';

    var ExtrasView = function() {

        this.foundSite = ko.computed(function(){
            return JSON.stringify(Controller.gadget.selectedSite()) !== '{}';
        });

        this.clickQC = function(){
            var site = Controller.gadget.selectedSite();
            if (site.xact === undefined || site.trap_type === 'Omit'){
                alert("Cannot QC inspect trap that is not yet placed or previously omitted!");
            } else {
                if (DateFormatter.getOperationFormatDate(site.txn_date) === DateFormatter.getOperationFormatDate(Date.now()) && site.fail_reason !== undefined) {
                    alert("Trap cannot be QC inspected twice on the same day!");
                    Geolocation.start();
                } else {
                    if (Controller.gadget.relativePosition().distance > 100) {
                        alert("Inspections cannot be completed from more than 100 meters away. This may be due to GPS error now or during placement.");
                        Geolocation.start();
                    } else {
                        Controller.gadget.changeView('qcInspection');
                    }
                }
            }
        };

        this.clickHistory = function(){
            Controller.gadget.history = new HistoryView();
            DB.getTransactions().then(function(data){
                Controller.gadget.history.initialize(data);
                Controller.gadget.changeView('history');
            });

        };

        this.clickDownload = function(){
            //var list = Controller.gadget.bidUnitList;
            if (DB.checkConnection()) {
                Controller.gadget.changeView('download');
                /*if (list().length <= 0) {
                    var uri = encodeURI("http://yt.ento.vt.edu/SlowTheSpread/bidunits?format=json");
                    $.get(uri).done(function (data) {
                        _.each(data, function (unit) {
                            list.push(unit);
                        });
                    }).fail(function () {
                        alert(Controller.errors.timeout);
                        Controller.gadget.changeView('extras');
                    });
                }
                console.log(JSON.stringify(this.bidUnitList()));*/
            } else {
                alert(Controller.errors.network);
            }
        };

        this.clickUpload = function() {
            if (DB.checkConnection()) {
                Controller.gadget.changeView('upload');
            } else {
                alert(Controller.errors.network);
            }
        };
    };

    return ExtrasView;

});
