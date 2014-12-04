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

    var UploadView = function() {

        var initials = Controller.gadget.initials();
        var state = Controller.gadget.state();
        var loadDate = DateFormatter.getLoadFormatDate(Date.now());
        var batch = 'sts.' + state + '.' + DateFormatter.getBatchDate(Date.now());

        var activityFileName = initials + loadDate;
        var trackFileName = "Track" + initials + loadDate;
        var jobFileName = "job.dat";
        var activityPath = DB.root.toURL() + DB.activityLog;
        var trackPath = DB.root.toURL() + DB.trackLog;
        var jobPath = DB.root.toURL() + jobFileName;

        var logTransfer = new FileTransfer();
        logTransfer.onprogress = _.bind(function(pe){
            this.logProgress(Math.round(pe.loaded/pe.total*100));
        }, this);

        var trackTransfer = new FileTransfer();
        trackTransfer.onprogress = _.bind(function(pe){
            this.trackProgress(Math.round(pe.loaded/pe.total*100));
        }, this);

        var jobTransfer = new FileTransfer();
        jobTransfer.onprogress = _.bind(function(pe){
            this.jobProgress(Math.round(pe.loaded/pe.total*100));
        }, this);

        var uploadFailure = function(){
            logTransfer.abort();
            trackTransfer.abort();
            jobTransfer.abort();
            DB.deleteBackups(activityFileName + ".txt", trackFileName + ".txt");
        };

        this.showProgress = ko.observable(false);

        this.logProgress = ko.observable(0);
        this.trackProgress = ko.observable(0);
        this.jobProgress = ko.observable(0);

        this.progress = ko.computed(function(){
            var percent = (this.logProgress()/3) + (this.trackProgress()/3) + (this.jobProgress()/3);
            console.log(percent + '%');
            return percent + '%';
        }, this);

        this.cancel = function(){
            uploadFailure();
            Controller.gadget.changeView('home');
        };

        this.upload = function(){

            this.showProgress(true);

            DB.backUp(activityFileName + ".txt").then(DB.backUp(trackFileName + ".txt")).then(function(){
                DB.uploadFile(logTransfer, activityPath, batch, activityFileName).then(
                    function(){
                        DB.uploadFile(trackTransfer, trackPath, batch, trackFileName).then(
                            function(){
                                DB.uploadFile(jobTransfer, jobPath, batch, jobFileName).then(
                                    function(){
                                        alert('Upload Completed Successfully!');
                                        DB.deleteLogs();
                                        Controller.gadget.changeView('home');
                                    },
                                    function(){uploadFailure();}
                                );
                            },
                            function(){uploadFailure();}
                        );
                    },
                    function(){uploadFailure();}
                );
            });
        };

    };

    return UploadView;

});
