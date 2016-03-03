define(['jquery',
    'knockout',
    'src/util/Controller'
], function($,
            ko,
            Controller
    ) {

    'use strict';

    var InaccessibleView = function() {

        this.op = Controller.gadget.operationalSite();

        this.message = ko.computed(function(){
            var msg;
            msg = "<span>Current position is more than 100 meters<br>"
            msg += "from recorded trap location. This may be due<br>"
            msg += "to GPS error now or at the time of placement.<br><br>";
            msg += "Only click OK to complete an<br>";
            msg += "<span style='color:red;'><strong>INACCESSIBLE</strong></span> inspection!</span>"
            return msg;
        }, this);
    };

    return InaccessibleView;

});

