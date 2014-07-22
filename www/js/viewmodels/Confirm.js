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
            sites.remove(this.site);
            sites.push(this.op);
            DB.initialize().then(function() {
                DB.logOperation(Controller.gadget.codedString()).then( function() {
                    DB.saveSites(Controller.gadget.sitesList()).then( function() {
                        Controller.gadget.changeView('home');
                    });
                });
            });
            //Geolocation.findNearest(Controller.gadget.position().utm());
            Controller.gadget.manualLock(false);
        };

        this.message = ko.computed(function(){
            var msg;
            msg = "<span>Confirm ";
            if (this.op.visit !== undefined){
                if (this.op.pass_fail !== undefined){
                    msg += this.op.pass_fail + " ";
                    msg += this.op.visit + " QC Inspection of ";
                    msg += this.op.condition + " trap ";
                    if (this.op.fail_reason !== undefined){
                        msg += "(" + this.op.failReason + ") "
                    }
                } else {
                    msg += this.op.visit + " Inspection of ";
                    msg += this.op.condition + " trap with ";
                    msg += this.op.moth_count + " moths ";
                }
            } else if (this.op.trap_type === 'Omit'){
                msg += "omit (" + this.op.omit_reason + ") ";
            } else {
                msg += "placement of " + this.op.trap_type + " trap "
            }
            msg += "at site "
            msg += this.op.quad + ":" + this.op.site_id + ", coordinates ";
            msg += this.op.xact + "E, ";
            msg += this.op.yact + "N?</span>";
            return msg;
        }, this);
    };

    return ConfirmView;

});
