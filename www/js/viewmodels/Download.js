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

        var fileTransfer = new FileTransfer();

        var failRoutes = function(){
            if (Controller.gadget.sitesFiles().length > 0) {
                Controller.gadget.changeView('home');
            } else {
                Controller.gadget.exitApplication(Controller.errors.sites);
            }
        };

        this.ready = ko.computed(function(){
            return Controller.gadget.bidUnitList().length > 0;
        });

        this.states = ['IA','IL','IN','KY','MN','OH','NC','TN', 'VA','WI','WV'];

        this.selectedState = ko.observable();

        this.loadBidUnits = _.bind(function(){
            var list = Controller.gadget.bidUnitList;
            if (list().length <= 0) {
                var uri = encodeURI("http://yt.ento.vt.edu/SlowTheSpread/bidunits?format=json");
                $.get(uri).done(function (data) {
                    _.each(data, function (unit) {
                        list.push(unit);
                    });
                }).fail(function () {
                    alert(Controller.errors.timeout);
                    failRoutes();
                });
            }
            //console.log(JSON.stringify(this.bidUnitList()));
        }, this);

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

        this.cancel = function() {
            fileTransfer.abort();
            failRoutes();
        };

        this.download = function() {

            this.showProgress(true);

            var filename = this.downloadFilename();


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
            DB.initialize().then(function () {
                DB.fileExists(DB.activityLog).then(function (exists) {
                    if (exists) {
                        DB.fileExists(self.downloadFilename()).then(function (exists) {
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
