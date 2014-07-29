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
    };

    return ExtrasView;

});
