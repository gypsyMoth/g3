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

        this.states = ['IA','IL','IN','KY','MN','OH','NC','TN', 'VA','WI','WV'];

        this.selectedState = ko.observable(Controller.gadget.config().state);

        this.email = ko.observable(Controller.gadget.config().email);

        this.initials = ko.observable(Controller.gadget.config().initials);

        this.metric = ko.observable(Controller.gadget.config().metric);

        this.compass = ko.observable(Controller.gadget.config().compass);

        this.track = ko.observable(Controller.gadget.config().track);

        this.upload = ko.observable(Controller.gadget.config().directUpload);

        this.url = ko.observable(Controller.gadget.config().uploadURL);

        this.updateSettings = function(){
            var configuration = new Config();
            configuration.state = this.selectedState();
            configuration.email = this.email();
            configuration.initials = this.initials();
            configuration.metric = this.metric();
            configuration.compass = this.compass();
            configuration.track = this.track();
            configuration.directUpload = this.upload();
            configuration.uploadURL = this.url();
            Controller.gadget.config(configuration);
            DB.setConfig(configuration).then(
                function(){
                    Controller.gadget.changeView('home');
                }
            )
        };

    };

    return SettingsView;

});
