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

        this.tag = ko.observable('');

        this.showTag = ko.observable(false);

        var backupDir = function() {
            var directory;
            DB.root.getDirectory("Backups", {create: false}, function (dirEntry) {
                directory = dirEntry;
            });
            return directory;
        };

        var activity = {
            filename: initials + loadDate,
            backup: "",
            path: DB.root.toURL() + DB.activityLog,
            transfer: new FileTransfer(),
            found: false
        };

        activity.transfer.onprogress = _.bind(function(pe){
            this.logProgress(Math.round(pe.loaded/pe.total*100));
        }, this);

        var track = {
            filename: "Track" + initials + loadDate,
            backup: "",
            path: DB.root.toURL() + DB.trackLog,
            transfer: new FileTransfer(),
            found: false
        };

        track.transfer.onprogress = _.bind(function(pe){
            this.trackProgress(Math.round(pe.loaded/pe.total*100));
        }, this);

        var job = {
            filename: "job.dat",
            path: DB.root.toURL() + "job.dat",
            transfer: new FileTransfer(),
            found: false
        };

        job.transfer.onprogress = _.bind(function(pe){
            this.jobProgress(Math.round(pe.loaded/pe.total*100));
        }, this);

        var uploadFailure = _.bind(function(){
            activity.transfer.abort();
            track.transfer.abort();
            job.transfer.abort();
            DB.root.getDirectory("Backups", {create: true, exclusive: false}, function(dirEntry){
                DB.deleteFile(dirEntry, activity.backup);
                DB.deleteFile(dirEntry, track.backup);
            });
            this.showProgress(false);
        }, this);

        var uploadSuccess = function(){
            alert('Upload Completed Successfully!');
            DB.deleteFile(DB.root, DB.activityLog);
            DB.deleteFile(DB.root, DB.trackLog);
            Controller.gadget.changeView('home');
        };

        var checkFiles = _.bind(function(){

            var deferred = new $.Deferred();

            var tag = this.tag;
            var progress = this.showProgress;
            var show = this.showTag;

            DB.jobFile(job.filename).then(
                function(){
                    DB.fileExists(DB.root, DB.activityLog).then(
                        function(){
                            activity.found = true;
                            DB.root.getDirectory("Backups", {create: true, exclusive: false}, function(dirEntry) {
                                DB.fileExists(dirEntry, activity.filename + tag() + ".txt").then(
                                    function () {
                                        alert("Upload file already exists! Please add a new tag in the text box!");
                                        show(true);
                                        progress(false);
                                        tag('');
                                        deferred.reject();
                                    },
                                    function () {
                                        activity.filename = activity.filename + tag();
                                        activity.backup = activity.filename + ".txt";
                                        track.filename = track.filename + tag();
                                        track.backup = track.filename + ".txt";
                                        DB.backUp(activity.backup).then(
                                            DB.fileExists(DB.root, DB.trackLog).then(
                                                function () {
                                                    track.found = true;
                                                    DB.backUp(track.backup).then(function () {
                                                        deferred.resolve();
                                                    });
                                                },
                                                function () {
                                                    deferred.resolve();
                                                }
                                            )
                                        );
                                    }
                                );
                            });
                        },
                        function(){
                            alert("No activity log found! Please try again after a placement or inspection has been completed.");
                            Controller.gadget.changeView('home');
                            deferred.reject();
                        }
                    )
                },
                function(){
                    deferred.reject();
                }
            );
            return deferred.promise();
        }, this);

        this.showProgress = ko.observable(false);

        this.logProgress = ko.observable(0);
        this.trackProgress = ko.observable(0);
        this.jobProgress = ko.observable(0);

        this.progress = ko.computed(function(){
            var total = 3;
            var percent = (this.logProgress()/total) + (this.trackProgress()/total) + (this.jobProgress()/total);
            console.log(percent + '%');
            return percent + '%';
        }, this);

        this.cancel = function(){
            uploadFailure();
            Controller.gadget.changeView('home');
        };

        this.upload = function(){

            this.showProgress(true);

            checkFiles().then(
                function(){
                    DB.uploadFile(activity.transfer, activity.path, batch, activity.filename).then(
                        function () {
                            if (track.found) {
                                DB.uploadFile(track.transfer, track.path, batch, track.filename).then(
                                    function () {
                                        DB.uploadFile(job.transfer, job.path, batch, job.filename).then(
                                            function () {
                                                uploadSuccess();
                                            },
                                            function () {
                                                uploadFailure();
                                            }
                                        );
                                    },
                                    function () {
                                        uploadFailure();
                                    }
                                );
                            } else {
                                DB.uploadFile(job.transfer, job.path, batch, job.filename).then(
                                    function () {
                                        uploadSuccess();
                                    },
                                    function () {
                                        uploadFailure();
                                    }
                                );
                            }
                        },
                        function() {
                            uploadFailure();
                        }
                    );
                },
                function() {
                    uploadFailure();
                }
            );
        };
    };

    return UploadView;

});
