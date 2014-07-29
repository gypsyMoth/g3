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

    var QCView = function() {

        this.failOptions = ko.observableArray(Encoder.failReasons);

        this.selectedFail = ko.observable(Encoder.failReasons[0]);

        this.conditions = ko.observableArray(Encoder.conditions);

        this.selectedCondition = ko.observable(Encoder.conditions[0]);

        this.op = Controller.gadget.operationalSite();

        this.startQC = function(){
            this.op.visit = 'MIDSEASON';
            this.op.condition = this.selectedCondition().text;
            this.op.fail_reason = this.selectedFail().text;
            Controller.gadget.changeView('confirm');
        };
    };

    return QCView;

});
