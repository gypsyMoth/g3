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

    var SettingsView = function() {

        this.metric = ko.observable(Controller.gadget.config().metric);

        this.compass = ko.observable(Controller.gadget.config().compass);

        this.track = ko.observable(Controller.gadget.config().track);

        this.upload = ko.observable(Controller.gadget.config().directUpload);

        this.code = ko.observable();

        this.codeMatch = ko.observable(false);

        this.confirm = function() {
            if (this.code() === 'g2y0p1s5y') {
                this.codeMatch(true);
            } else {
                alert("Incorrect Passcode!");
                this.codeMatch(false);
            }
        }

        this.updateSettings = function(){
            Controller.gadget.config().metric = this.metric();
            Controller.gadget.config().compass = this.compass();
            Controller.gadget.config().track = this.track();
            Controller.gadget.config().directUpload = this.upload();
            DB.setConfig(Controller.gadget.config()).then(
                function(){
                    Controller.gadget.changeView('home');
                }
            )
        };

    };

    return SettingsView;

});
