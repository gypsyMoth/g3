define(['jquery',
    'knockout',
    'src/util/Controller'
], function($,
            ko,
            Controller
    ) {

    'use strict';

    var PlacementView = function() {

        this.trap_types = ko.observableArray(['Delta', 'Milk Carton']);

        this.selectedTrap = ko.observable(Controller.gadget.selectedSite().trap_type);

        this.op = Controller.gadget.operationalSite();

        this.startPlacement = function(){
            this.op.trap_type = this.selectedTrap();
            console.log(JSON.stringify(this.op));
            Controller.gadget.changeView('confirm');
        };

        this.startOmit = function(){
            Controller.gadget.changeView('omit');
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
