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

    var InspectionView = function() {

        this.visitTypes = ko.observableArray(Encoder.visits);

        this.selectedVisit = ko.observable(Encoder.visits[0]);

        this.conditions = ko.observableArray(Encoder.conditions);

        this.selectedCondition = ko.observable(Encoder.conditions[0]);

        this.op = Controller.gadget.operationalSite();

        this.moths = ko.observable();

        this.showCount = ko.computed(function(){
            if (this.selectedCondition().text === "GOOD" || this.selectedCondition().text === "DAMAGED"){
                return true;
            } else {
                this.moths(undefined);
                return false;
            }
        }, this);

        this.startInspection = function(){
            if (this.moths() > 999){
                alert("Invalid moth count! Maximum value 999! Please enter a new value.");
                this.moths(undefined);
            } else {
                this.op.visit = this.selectedVisit().text;
                this.op.condition = this.selectedCondition().text;
                if (this.moths()) {
                    this.op.moth_count = this.moths();
                } else {
                    this.op.moth_count = 0;
                }
                Controller.gadget.changeView('confirm');
            }
        };

    };

    return InspectionView;

});

