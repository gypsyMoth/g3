define(['jquery',
    'knockout',
    'src/util/Controller'
], function($,
            ko,
            Controller
    ) {

    'use strict';

    var CautionView = function() {

        this.message = ko.computed(function(){
            var msg;
            msg = "<span>You are ";
            msg += Controller.gadget.relativePosition().distanceOutside;
            msg += " meters outside the target circle.</span><br>";
            msg += "<span>Do you wish to continue?</span>"
            return msg;
        }, this);
    };

    return CautionView;

});

