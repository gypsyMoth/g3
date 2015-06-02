define(['jquery',
    'knockout',
    'src/util/Encoder',
    'src/util/Controller'
], function($,
            ko,
            Encoder,
            Controller
    ) {

    'use strict';

    var OmitView = function() {

        this.omit_reasons = Encoder.omitReasons;

        this.selectedReason = ko.observable(Encoder.omitReasons[0]);

        this.op = Controller.gadget.operationalSite();

        this.startOmit = function(){
            this.op.trap_type = 'Omit';
            this.op.xact = Controller.gadget.selectedSite().xth;
            this.op.yact = Controller.gadget.selectedSite().yth;
            this.op.omit_reason = this.selectedReason().text;
            Controller.gadget.changeView('confirm');
        };
    };

    return OmitView;

});
