define(['jquery',
    'knockout',
    'src/util/Controller'
], function($,
            ko,
            Controller
    ) {

    'use strict';

    var PlacementView = function() {

        this.trap_types = ['Delta', 'Milk Carton'];

        this.selectedTrap = ko.observable(Controller.gadget.selectedSite().trap_type);

        this.op = Controller.gadget.operationalSite();

        this.startPlacement = function(){
            this.op.trap_type = this.selectedTrap();
            Controller.gadget.changeView('confirm');
            /*if (Controller.gadget.relativePosition().distanceOutside > 0){
                Controller.gadget.changeView('caution');
            } else {
                Controller.gadget.changeView('confirm');
            }*/
        };

        this.message = ko.computed(function(){
            var msg;
            msg = "<span>at site "
            msg += this.op.quad + ":" + this.op.site_id;
            msg += "</span><br>";
            msg += "<span>" + this.op.xact + "E, ";
            msg += this.op.yact + "N</span>"
            return msg;
        }, this);
    };

    return PlacementView;

});
