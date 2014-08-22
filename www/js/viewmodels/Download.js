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

        this.bidUnits = _.range(99);

        this.selectedBidUnit = ko.observable();

        this.showProgress = ko.observable(false);

        this.progress = ko.observable('0%');

        this.downloadFile = function(){
            var fileExists = false; /*DB.initialize().then(function(){
                DB.root.getFile(DB.activityLog, {})
            }); //, function(){return true;}, function(){return false;});
            alert (fileExists);*/
            if (fileExists) {
                alert("Please upload transaction log prior to downloading a new sites file.")
            } else {
                this.showProgress(true);

                var fileTransfer = new FileTransfer();
                fileTransfer.onprogress = _.bind(function(pe){
                    var percent = Math.round(pe.loaded/pe.total*100)
                    console.log(percent + "%");
                    this.progress(percent + "%");
                }, this);

                DB.downloadSites(fileTransfer, this.selectedState(), this.selectedBidUnit()).then(function(data){
                    DB.getSitesFiles().then(_.bind(function(sitesFiles) {
                        Controller.gadget.sitesFiles(sitesFiles);
                    }, this));
                    alert("Download Complete!");
                    Controller.gadget.changeView('loadSites');
                }, this);
            };
        };

    };

    return DownloadView;

});
