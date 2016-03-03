define(['jquery',
    'knockout',
    'src/util/Encoder',
    'src/util/DB',
    'src/util/Controller'
], function($,
            ko,
            Encoder,
            DB,
            Controller
    ) {

    'use strict';

    var InspectionView = function() {

        this.defaultInspection = Controller.gadget.config().inspection_type;

        this.visitTypes = ko.observableArray(Encoder.visits);

        this.selectedVisit = ko.observable(Encoder.visits[this.defaultInspection]);

        this.conditions = ko.observableArray(Encoder.conditions);

        this.enableCondition = ko.observable(true);

        this.selectedCondition = ko.computed(function(){
            if (Controller.gadget.relativePosition().distanceOutside > 100) {
                this.enableCondition(false);
                return Encoder.conditions[3];
            } else {
                return Encoder.conditions[0];
            }
        }, this);

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
                this.defaultInspection = Encoder.visits.indexOf(this.selectedVisit());

                this.op.condition = this.selectedCondition().text;
                if (this.moths()) {
                    this.op.moth_count = this.moths();
                } else {
                    this.op.moth_count = 0;
                }

                Controller.gadget.config().inspection_type = this.defaultInspection;
                DB.setConfig(Controller.gadget.config()).then(
                    function(){
                        Controller.gadget.changeView('confirm');
                    }
                );
                //Controller.gadget.changeView('confirm');
            }
        };

    };

    return InspectionView;

});

