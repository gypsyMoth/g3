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

        this.download = function() {
            this.showProgress(true);

            var fileTransfer = new FileTransfer();
            fileTransfer.onprogress = _.bind(function(pe){
                var percent = Math.round(pe.loaded/pe.total*100);
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

        this.requestDownload = function(){
            //var self = this;
            DB.initialize().then(_.bind(function(){
                DB.root.getFile(DB.activityLog, {create: false},
                function(){
                    alert("Please upload transaction log prior to downloading a new sites file.")
                },
                _.bind(function(){
                    this.download();
                },this));
            },this));
        };

    };

    return DownloadView;

});
