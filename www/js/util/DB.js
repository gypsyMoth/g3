define (['jquery',
    'underscore',
    'src/models/SitesFile',
    'src/collections/SitesFileCollection'],
    function ($, _, SitesFile, SitesFileCollection) { 'use strict';
        var my = {};

        var PERSISTENT;

        my.root = null;
        my.filesystem = null;
        my.filecount = 0;
        my.sitesFile = null;
        my.activityLog = "trans_log.txt";

        my.initialize = function() {
            return getFileSystem().then(getRootDirectory);
        };

        var getFileSystem = function() {
            var deferred = new $.Deferred();
            checkIfFileSystemIsDefined();

            var grantedBytes = 0;
            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
            //window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
                window.requestFileSystem(PERSISTENT, grantedBytes, function(fileSystem) {
                        my.filesystem = fileSystem;
                        deferred.resolve();
                    }, function(error) {
                        console.error("getFileSystem: " + error.code);
                });
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
            var deferred = new $.Deferred();
            console.log(my.filesystem.root.toURL());
            my.filesystem.root.getDirectory("G3", {create: true, exclusive: false}, function(dirEntry) {
                my.root = dirEntry;
                deferred.resolve();
            }, function(error) {
                console.error("getRootDirectory: " + error.code);
            });
            return deferred.promise();
        };

        my.getSitesFiles = function() {
            var deferred = new $.Deferred();
            var sitesFiles = [];
            var directoryReader = my.root.createReader();
            directoryReader.readEntries(function(entries) {
                _.each(my.filterSitesFiles(entries), function(fileEntry) {
                    sitesFiles.push(new SitesFile({fileEntry: fileEntry}));
                });
               deferred.resolve(new SitesFileCollection(sitesFiles));
            }, my.fail);
            return deferred.promise();
        };

        my.filterSitesFiles = function(entries) {
            var reg = /([^\s]+(\.(json|JSON))$)/;
            return _.filter(entries, function(entry) {
                return entry.isFile && reg.test(entry.name);
            });
        };

        my.loadSites = function(fileEntry) {
            var deferred = new $.Deferred();
            getFile(fileEntry).then(loadFile).then(function(data) {
                my.sitesFile = fileEntry.name;
                deferred.resolve(data);
            });
            return deferred.promise();
        };

        var makeFilename = function(state, bidunit) {
            return state + "_" + bidunit + ".json";
        };

        var getFileEntry = function(dirEntry, filename, params) {
            var deferred = new $.Deferred();
            dirEntry.getFile(filename, params,
            function gotFileEntry(fileEntry) {
                deferred.resolve(fileEntry);
            });
            return deferred.promise();
        };

        var getFile = function(fileEntry) {
            var deferred = new $.Deferred();
            fileEntry.file( function success(file) {
                deferred.resolve(file);
            }, my.fail);
            return deferred.promise();
        };

        var loadFile = function(file) {
            var deferred = new $.Deferred();
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                deferred.resolve(JSON.parse(evt.target.result));
            };
            reader.readAsText(file);
            return deferred.promise();
        };

        my.downloadSites = function (state, bidunit){
            var deferred = new $.Deferred();
            var fileTransfer = new FileTransfer();
            var uri = encodeURI("http://yt.ento.vt.edu/SlowTheSpread/gadgetsites/" + state + "/" + bidunit + "?format=json");
            var filename = my.root.fullPath + '/' + makeFilename(state, bidunit);

            fileTransfer.download(
                uri,
                filename,
                function(entry) {
                    console.log("G3 file downloaded; filename = " + filename + "; fileentry = " + entry.fullPath);
                    getFile(entry).then(loadFile).then(function() {
                        deferred.resolve();
                    });
                },
                function(error) {
                    if (error.code === 3) {
                        alert("No network connection");
                    } else {
                        console.log(error.code);
                    }
                    deferred.reject();
                }
            );
            return deferred.promise();
        };

        my.saveSites = function(sitesList) {
            var deferred = new $.Deferred();
            var data = JSON.stringify(sitesList);
            getFileEntry(my.root, my.sitesFile, {create: true, exclusive: false}).then(function(fileEntry) {
                writeFile(fileEntry, data).then( function() {
                    deferred.resolve();
                });
            });
            return deferred.promise();
        };

        var writeFile = function(fileEntry, data) {
            var deferred = new $.Deferred();
            fileEntry.createWriter(function(writer) {
                writer.onwriteend = function(evt) {
                    deferred.resolve();
                };
                writer.write(data);
            }, my.fail);
            return deferred.promise();
        };

        my.logOperation = function(data) {
            var deferred = new $.Deferred();
            getFileEntry(my.root, my.activityLog, {create: true, exclusive: false}).then(function(fileEntry) {
                appendFile(fileEntry, data).then( function() {
                    deferred.resolve();
                });
            });
            return deferred.promise();
        };

        var appendFile = function(fileEntry, data) {
            var deferred = new $.Deferred();
            fileEntry.createWriter(function(writer) {
                writer.onwriteend = function(evt) {
                    deferred.resolve();
                };
                writer.seek(writer.length);
                writer.write(data);
            }, my.fail);
            return deferred.promise();
        };

        my.fail = function(error) {
            console.error(error.code);
            throw error;
        };

        return my;
});