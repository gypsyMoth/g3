/*Created by Ian on 1/15/14.*/

app.db = (function () {
    var my = {};

    var PERSISTENT;

    my.initialize = function() {
        return getFileSystem().then(getRootDirectory);
    };

    var getFileSystem = function() {
        var deferred = $.Deferred();
        checkIfFileSystemIsDefined();

        var grantedBytes = 0;
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        //window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
        window.requestFileSystem(PERSISTENT, grantedBytes, function(fileSystem) {
                app.Filesystem = fileSystem;
                deferred.resolve();
            }, app.fail);
        //});
        return deferred.promise();
    };

    var checkIfFileSystemIsDefined = function() {
        if (typeof LocalFileSystem === 'undefined') {
            PERSISTENT = window.PERSISTENT;
        } else {
            PERSISTENT = LocalFileSystem.PERSISTENT ;
        }
    };

    var getRootDirectory = function() {
        var deferred = $.Deferred();
        app.Filesystem.root.getDirectory("com.phonegap.g3", {create: true }, function(dirEntry) {
            app.Root = dirEntry;
            deferred.resolve();
        }, app.fail);
        return deferred.promise();
    };

    my.countFiles = function() {
        var deferred = $.Deferred();
        var directoryReader = app.Root.createReader();
        var fileCount = directoryReader.readEntries(function(entries) {
           app.fileCount = entries.length;
           deferred.resolve();
        }, app.fail);
        return deferred.promise();
    };

    my.loadSites = function(state, bidunit) {
        //var deferred = $.Deferred();
        app.Root.getFile(makeFilename(state, bidunit),
            { create: false },
            loadLocal,
            app.fail
        );
        //return deferred.promise();
    };

    var makeFilename = function(state, bidunit) {
        return state + "_" + bidunit + "json";
    };

    var loadLocal = function (fileEntry){
        fileEntry.file(loadFile, app.fail);
    };

    var loadFile = function(file) {
        //var deferred = $.Deferred();
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("G3 " + evt.target.result);
            app.SitesList = JSON.parse(evt.target.result);
            //deferred.resolve();
        };
        reader.readAsText(file);
        //return deferred;
    };

    my.downloadSites = function (state, bidunit){

        var deferred = $.Deferred();

        var fileTransfer = new FileTransfer();
        var uri = encodeURI("http://yt.ento.vt.edu/SlowTheSpread/gadgetsites/" + state + "/" + bidunit + "?format=json");

        fileTransfer.download(
            uri,
            app.Root.fullPath + "/" + makeFilename(state, bidunit),
            function(entry) {
                loadLocal(entry);
                deferred.resolve();
            }, app.fail
        );
        return deferred.promise();
    };

    return my;
}());