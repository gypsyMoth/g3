define(['jquery',
    'knockout',
    'src/util/Controller'
], function($,
            ko,
            Controller
    ) {

    'use strict';

    var OmitView = function() {

        this.omit_reasons = ['Delta', 'Milk Carton'];

        this.op = Controller.gadget.operationalSite();

        this.startOmit = function(){
            this.op.trap_type = 'Omit';
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

    return OmitView;

});
