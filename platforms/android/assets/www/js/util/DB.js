/*Created by Ian on 1/15/14.*/

app.db = (function () {
    var my = {};

    var PERSISTENT;

    my.sitesFile = 'TX_1.json';

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
        app.Filesystem.root.getDirectory("com.phonegap.g3", {create: true, exclusive: false }, function(dirEntry) {
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
        var deferred = $.Deferred();
        getFileEntry(app.Root, makeFilename(state, bidunit), {create: false}).then(getFile).then(loadFile).then(deferred.resolve());
        return deferred.promise();
    };

    var makeFilename = function(state, bidunit) {
        return state + "_" + bidunit + ".json";
    };

    var getFileEntry = function(dirEntry, filename, params) {
        var deferred = $.Deferred();
        dirEntry.getFile(filename, params,
        function gotFileEntry(fileEntry) {
            deferred.resolve(fileEntry);
        });
        return deferred.promise();
    };

    var getFile = function(fileEntry) {
        var deferred = $.Deferred();
        fileEntry.file( function success(file) {
            deferred.resolve(file);
        }, app.fail);
        return deferred.promise();
    };

    var loadFile = function(file) {
        var deferred = $.Deferred();
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("G3 " + evt.target.result);
            app.SitesList = JSON.parse(evt.target.result);
            deferred.resolve();
        };
        reader.readAsText(file);
        return deferred.promise();
    };

    my.downloadSites = function (state, bidunit){
        var deferred = $.Deferred();
        var fileTransfer = new FileTransfer();
        var uri = encodeURI("http://yt.ento.vt.edu/SlowTheSpread/gadgetsites/" + state + "/" + bidunit + "?format=json");

        fileTransfer.download(
            uri,
            app.Root.fullPath + "/" + makeFilename(state, bidunit),
            function(entry) {
                getFile(entry).then(loadFile).then(deferred.resolve());
            }, app.fail
        );
        return deferred.promise();
    };

    my.saveSites = function (sitesList) {
        var deferred = new $.Deferred();
        app.Root.getFile(this.sitesFile, {create: true, exclusive: false}, function(fileEntry) {
            fileEntry.createWriter(function(writerObject) {
                writerObject.onwriteend = function(evt) {
                    deferred.resolve();
                    console.log("G3 Wrote sites file");
                };
                var stringList = JSON.stringify(sitesList);
                console.log(stringList);
                writerObject.write(stringList);
            }, app.fail);
        }, app.fail);
        return deferred.promise();
    };

    return my;
}());