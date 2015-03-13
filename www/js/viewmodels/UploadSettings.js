define(['jquery',
    'underscore',
    'knockout',
    'src/util/DB',
    'src/util/Date',
    'src/models/Config',
    'src/util/Controller'
], function($,
            _,
            ko,
            DB,
            DateFormatter,
            Config,
            Controller
    ) {

    'use strict';

    var UploadSettingsView = function() {

        this.states = ['', 'IA','IL','IN','KY','MN','OH','NC','TN', 'VA','WI','WV'];

        this.selectedState = ko.observable(Controller.gadget.config().state);

        this.email = ko.observable(Controller.gadget.config().email);

        this.initials = ko.observable(Controller.gadget.config().initials);

        this.url = ko.observable(Controller.gadget.config().uploadURL);

        this.updateSettings = function(){
            var state = this.selectedState();
            var email = this.email();
            var initials = this.initials();
            var url = this.url();
            if (!state && state === '') {
                alert("Please select a state");
            } else if (!email || email === '') {
                alert("Please enter an email address!");
            } else if (email.length > 100) {
                alert("Email address field must be 100 characters or less");
            } else if (!initials || initials === '') {
                alert("Please enter initials!");
            } else if (initials.length > 3) {
                alert("Initials must be 3 characters or less");
            } else if (url !== 'TrapData' && url !== 'Direct') {
                alert("Please enter a valid website URL for data uploads!")
            } else {
                Controller.gadget.config().state = state;
                Controller.gadget.config().email = email;
                Controller.gadget.config().initials = initials;
                Controller.gadget.config().uploadURL = url;
                DB.setConfig(Controller.gadget.config()).then(
                    function () {
                        Controller.gadget.changeView('upload');
                });
            }
        };

    };

    return UploadSettingsView;

});
