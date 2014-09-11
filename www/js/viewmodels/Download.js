define(['jquery',
    'underscore',
    'knockout',
    'src/util/DB',
    'src/util/Controller'
], function($,
            _,
            ko,
            DB,
            Controller
    ) {

    'use strict';

    var DownloadView = function() {

        this.states = ['IA','IL','IN','KY','MN','OH','NC','VA','WI','WV'];

        this.selectedState = ko.observable();

        this.bidUnits = ko.computed(function(){
            var state = this.selectedState();
            var units = _.filter(Controller.gadget.bidUnitList(), function(unit) {
                return unit.state === state;
            });
            console.log(units);
            return units.length > 0 ? units : [{state:'', bidunit:'Loading Bid Units...'}];
        }, this);

        this.selectedBidUnit = ko.observable();

        this.showProgress = ko.observable(false);

        this.progress = ko.observable('0%');

        this.download = function() {
            this.showProgress(true);

            var fileTransfer = new FileTransfer();
            fileTransfer.onprogress = _.bind(function(pe){
                var percent = Math.round(pe.loaded/pe.total*100);
                console.log(percent + "%");
                this.progress(percent + "%");
            }, this);

            DB.downloadSites(fileTransfer, this.selectedState(), this.selectedBidUnit().bidunit).then(function(data){
                DB.getSitesFiles().then(_.bind(function(sitesFiles) {
                    Controller.gadget.sitesFiles(sitesFiles);
                }, this));
                alert("Download Complete!");
                Controller.gadget.changeView('loadSites');
            }, this);
        };

        this.requestDownload = function(){
            var self = this;
            var filename = this.selectedState() + "_" + this.selectedBidUnit().bidunit + ".json"
            DB.initialize().then(function(){
                DB.fileExists(DB.activityLog).then(function(exists){
                    if (exists){
                        DB.fileExists(filename).then(function(exists){
                            if (exists) {
                                 alert("Please upload transaction log prior to downloading a new sites file.");
                             } else {
                                 self.download();
                             }
                        });
                    }
                    else {
                        self.download();
                    }
                });
            });
        };
    };

    return DownloadView;

});
