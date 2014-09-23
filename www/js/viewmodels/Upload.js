define(['jquery',
    'knockout',
    'src/util/DB',
    'src/util/Date',
    'src/util/Controller'
], function($,
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

            var loadDate = DateFormatter.getLoadFormatDate(Date.now());
            var initials = 'BGP'
            var fileTransfer = new FileTransfer();

            fileTransfer.onprogress = _.bind(function(pe){
                var percent = Math.round(pe.loaded/pe.total*100);
                console.log(percent + "%");
                this.progress(percent + "%");
            }, this);

            DB.uploadTransLog(fileTransfer, initials, loadDate).then(function(){
                alert('Upload Completed Successfully!');
                Controller.gadget.changeView('home');
            });
        };

    };

    return UploadView;

});
