define(['jquery',
    'knockout',
    'src/util/DB',
    'src/util/Geolocation',
    'src/util/Encoder',
    'src/util/Controller'
], function($,
            ko,
            DB,
            Geolocation,
            Encoder,
            Controller
    ) {

    'use strict';

    var ConfirmView = function() {

        this.site = Controller.gadget.selectedSite();

        this.op = Controller.gadget.operationalSite();

        this.confirmOperation = function(){
            var sites = Controller.gadget.sitesList;
            var operation = Encoder.codedString();
            sites.remove(this.site);
            sites.push(this.op);
            DB.initialize().then(function() {
                DB.logOperation(operation).then( function() {
                    DB.saveSites(Controller.gadget.sitesList()).then( function() {
                        Controller.gadget.changeView('home');
                    });
                });
            });
            Controller.gadget.manualLock(false);
        };

        this.message = ko.computed(function(){
            var msg;
            msg = "";//<span>";//Confirm ";
            if (this.op.visit){
                if (this.op.fail_reason){
                    if (this.op.fail_reason === 'Passed'){
                        msg += this.op.fail_reason.toUpperCase() + " ";
                    } else {
                        msg += "FAILED ";
                    }
                    //msg += this.op.visit
                    msg += " QC Inspection of " + this.op.condition + " trap ";
                    if (this.op.fail_reason !== 'Passed'){
                        msg += "(" + this.op.fail_reason + ") "
                    }
                } else {
                    msg += this.op.visit + " Inspection of ";
                    msg += this.op.condition + " trap with ";
                    msg += this.op.moth_count + " moths ";
                }
            } else if (this.op.trap_type === 'Omit'){
                msg += "OMIT (" + this.op.omit_reason + ") ";
            } else {
                msg += "Placement of " + this.op.trap_type.toUpperCase() + " trap ";
                if (Controller.gadget.relativePosition().distanceOutside > 0){
                    msg += "(outside target circle) ";
                }
            }
            msg += "at site "
            msg += this.op.quad + ":" + this.op.site_id + ", coordinates ";
            msg += this.op.xact + "E, ";
            msg += this.op.yact + "N?";//</span>";
            return msg;
        }, this);
    };

    return ConfirmView;

});
