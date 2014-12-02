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

        this.ready = ko.computed(function(){
            return Controller.gadget.bidUnitList().length > 0;
        });

        this.states = ['IA','IL','IN','KY','MN','OH','NC','VA','WI','WV'];

        this.selectedState = ko.observable();

        this.bidUnits = ko.computed(function(){
            var state = this.selectedState();
            var units = _.filter(Controller.gadget.bidUnitList(), function(unit) {
                return unit.state === state;
            });
            return units.length > 0 ? units : [{state:'', bidunit: 'Loading...'}];
        }, this);

        this.selectedBidUnit = ko.observable('');

        this.showProgress = ko.observable(false);

        this.progress = ko.observable('0%');

        this.downloadFilename = ko.computed(function(){
           return this.selectedState() + "_" + this.selectedBidUnit().bidunit + ".json"
        }, this);

        this.download = function() {

            this.showProgress(true);

            var filename = this.downloadFilename();

            var fileTransfer = new FileTransfer();
            fileTransfer.onprogress = _.bind(function(pe){
                var percent = Math.round(pe.loaded/pe.total*100);
                console.log(percent + "%");
                this.progress(percent + "%");
            }, this);

            var loadDownloadedSites = function(fileEntry){
                DB.loadSites(fileEntry).then(_.bind(function (data) {
                    Controller.gadget.sitesList(data);
                }, this));
                Controller.gadget.manualLock(false);
                Controller.gadget.changeView('home');
            };

            DB.downloadSites(fileTransfer, this.selectedState(), this.selectedBidUnit().bidunit).then(function(){
                DB.getSitesFiles().then(function(sitesFiles) {
                    Controller.gadget.sitesFiles(sitesFiles);
                    DB.root.getFile(filename, {create: false},
                        function(entry){
                            loadDownloadedSites(entry);
                        },
                        function(error){
                            console.log(error.code);
                        }
                    );
                });
            });

        };

        this.requestDownload = function(){
            var self = this;
            DB.initialize().then(function(){
                DB.fileExists(DB.activityLog).then(function(exists){
                    if (exists){
                        DB.fileExists(self.downloadFilename()).then(function(exists){
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
