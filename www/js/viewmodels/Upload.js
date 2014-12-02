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

        this.showProgress = ko.observable(false);

        this.progress = ko.observable('0%');

        this.upload = function(){

            this.showProgress(true);

            var initials = Controller.gadget.initials();
            var state = Controller.gadget.state();
            var loadDate = DateFormatter.getLoadFormatDate(Date.now());
            var batch = 'sts.' + state + '.' + DateFormatter.getBatchDate(Date.now());

            var fileTransfer = new FileTransfer();

            var activityFileName = initials + loadDate;
            var trackFileName = "Track" + initials + loadDate;
            var jobFileName = "job.dat";
            var activityPath = DB.root.toURL() + DB.activityLog;
            var trackPath = DB.root.toURL() + DB.trackLog;
            var jobPath = DB.root.toURL() + jobFileName;

            fileTransfer.onprogress = _.bind(function(pe){
                var percent = Math.round(pe.loaded/pe.total*100);
                console.log(percent + "%");
                this.progress(percent + "%");
            }, this);

            DB.uploadFile(fileTransfer, activityPath, batch, activityFileName).then(function(){
                DB.uploadFile(new FileTransfer(), trackPath, batch, trackFileName).then(function(){
                    DB.uploadFile(new FileTransfer(), jobPath, batch, jobFileName).then(function(){
                        alert('Upload Completed Successfully!');
                        Controller.gadget.changeView('home');
                    });
                });
            });
        };

    };

    return UploadView;

});
