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

        this.states = ['IA','IL','IN','KY','MN','OH','NC','TN', 'VA','WI','WV'];

        this.selectedState = ko.observable(Controller.gadget.config().state);

        this.email = ko.observable(Controller.gadget.config().email);

        this.initials = ko.observable(Controller.gadget.config().initials);

        this.url = ko.observable(Controller.gadget.config().uploadURL);

        this.updateSettings = function(){
            var state = this.selectedState();
            var email = this.email();
            var initials = this.initials();
            var url = this.url();
            Controller.gadget.config().state = state;
            Controller.gadget.config().email = email;
            Controller.gadget.config().initials = initials;
            Controller.gadget.config().uploadURL = url;
            DB.setConfig(Controller.gadget.config()).then(
                function(){
                    if ((email && email !== '') && (initials && initials !== '') && (state && state !== '') && (url === 'TrapData' || url === 'Direct')){
                        Controller.gadget.changeView('upload');
                    } else {
                        alert("Please configure proper state, email address, initials, and upload URL prior to uploading data!");
                    }
                }
            );
        };

    };

    return UploadSettingsView;

});
