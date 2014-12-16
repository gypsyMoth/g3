define(['jquery',
    'underscore',
    'knockout',
    'src/util/DB',
    'src/util/Date',
    'src/util/Controller'
], function($,
            _,
            ko,
            DB,
            DateFormatter,
            Controller
    ) {

    'use strict';

    var SettingsView = function() {

        this.config = ko.computed(function(){
            return Controller.gadget.config();
        });

        this.states = ['IA','IL','IN','KY','MN','OH','NC','TN', 'VA','WI','WV'];

        this.selectedState = ko.observable(this.config.state);

        this.email = ko.observable(this.config.email);

        this.initials = ko.observable(this.config.initials);

        this.measureArray = [{label: 'Metric', value: true}, {label: 'US', value: false}];

        this.selectedMeasure = ko.observable(this.measureArray[false]);

        this.compassArray = [{label: 'On', value: true}, {label: 'Off', value: false}];

        this.selectedCompass = ko.observable(Controller.gadget.state());

        this.trackArray = [{label: 'On', value: true}, {label: 'Off', value: false}];

        this.selectedTrack = ko.observable(Controller.gadget.state());

        this.uploadArray = [{label: 'On', value: true}, {label: 'Off', value: false}];

        this.selectedUpload = ko.observable(Controller.gadget.directUpload());

        this.updateSettings = function(){
            Controller.gadget.state(this.selectedState());
            Controller.gadget.initials(this.initials());
            Controller.gadget.email(this.email());
            Controller.gadget.metric(this.selectedMeasure().value);
            Controller.gadget.compass(this.selectedCompass().value);
            Controller.gadget.track(this.selectedTrack().value);
            Controller.gadget.directUpload(this.selectedUpload().value);
            alert(this.selectedState() + " " + this.initials() + " " + this.email() + " " + this.selectedMeasure() + " " + this.selectedCompass() + " " + this.selectedTrack()+ " " + this.selectedUpload());
            Controller.gadget.changeView('home');
        };

    };

    return SettingsView;

});
