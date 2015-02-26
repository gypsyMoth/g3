define(['jquery',
    'knockout',
    'src/util/DB',
    'src/util/Controller'
], function($,
            ko,
            DB,
            Controller
    ) {

    'use strict';

    var AboutView = function() {

        this.message = ko.computed(function(){
            var msg;
            msg = "<span class='bigMessage'>GMSTS Trapper Gadget</span><br><br>";
            msg += "<span class='message'>G3 Mobile Application</span><br>";
            msg += "<span class='message'>Version 1.0.0</span><br>";
            msg += "<br><span class='message'>For technical support<br>please call\u2060" + "(540) 231-4461" + "\u2060</span>";
            return msg;
        }, this);
    };

    return AboutView;

});
