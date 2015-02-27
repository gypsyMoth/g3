define (['jquery',
    'underscore',
    'src/models/SitesFile',
    'src/models/Config',
    'src/util/Date',
    'src/util/Controller'],
    function ($, _, SitesFile, Config, DateFormatter, Controller) { 'use strict';
        var my = {};

        var PERSISTENT;

        my.root = null;
        my.filesystem = null;
        my.filecount = 0;
        my.sitesFile = null;
        my.trackLog = "crumbs.txt";
        my.activityLog = "trans_log.txt";
        my.urlPrefix = "http://testskynet.ento.vt.edu/"; //TEST
        //my.urlPrefix = "http://yt.ento.vt.edu/"; //PRODUCTION

        my.getConfig = function(){
            var deferred = new $.Deferred();
            my.fileExists(my.root, 'config').then(
                function(entry){
                    getFile(entry).then(loadFile).then(function(data){
                        Controller.gadget.config(JSON.parse(data));
                        deferred.resolve();
                    });
                },
                function(){
                    getFileEntry(my.root, 'config', {create: true, exclusive: false}).then(function(entry){
                        var configuration = new Config();
                        writeFile(entry, JSON.stringify(configuration)).then(
                            function(){
                                Controller.gadget.config(configuration);
                                deferred.resolve();
                            },
                            function(){
                                alert("Unable to create config file!");
                                deferred.reject();
                            }
                        );
                    });
                }
            );
            return deferred.promise();
        };

        my.setConfig = function(data){
            var deferred = new $.Deferred();
            getFileEntry(my.root, 'config', {create: true, exclusive: false}).then(function(entry){
                writeFile(entry, JSON.stringify(data)).then(
                    function(){
                        my.jobFile('job.dat');
                        deferred.resolve();
                    },
                    function(){
                        alert("Unable to write config file!");
                        deferred.reject();
                    }
                );
            });
            return deferred.promise();
        };

        my.initialize = function() {
            return getFileSystem().then(getRootDirectory).then(function(){
                my.getConfig();
            });
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
            /*var sd = "file:///storage/extSdCard";
            window.resolveLocalFileSystemURL(
                sd,
                function(entry){
                    var myFileSystem = entry.filesystem;
                    myFileSystem.root.getDirectory("storage/extSdCard/G3", {create: true, exclusive:false},
                        function(dirEntry){
                            my.root = dirEntry;
                            console.log(dirEntry.name + " CREATED ON EXTERNAL SD CARD!");
                            deferred.resolve();
                        },
                        function(error){
                            console.error("EXTERNAL getRootDirectory: " + error.code);
                        }
                    );
                },
                // The mess that "looped" me into the external sdcard...
                    /*var dirReader = entry.filesystem.root.createReader();
                    dirReader.readEntries(
                        function(entries){
                            var i = 1
                            alert("LEVEL ONE");
                            _.each(entries, function(entry){
                                alert(i + " " + entry.name);
                                if (entry.name === 'storage'){
                                    var subReader = entry.createReader();
                                    subReader.readEntries(
                                        function(subEntries){
                                            alert("LEVEL TWO");
                                            _.each(subEntries, function(subEntry){
                                                alert(subEntry.name);
                                                if (subEntry.name === 'extSdCard'){
                                                    var subSubReader = entry.createReader();
                                                    subSubReader.readEntries(
                                                        function(subSubEntries){
                                                            alert("LEVEL THREE");
                                                            _.each(subSubEntries, function(subSubEntry){
                                                                var cardUrl = subSubEntry.nativeURL;
                                                                alert(cardUrl);
                                                                if (subSubEntry.nativeURL === cardUrl){
                                                                    alert("GOT CARD!");
                                                                    subSubEntry.getDirectory("G3_TEST", {create: true, exclusive:false}, function(dirEntry){
                                                                        alert(dirEntry.name + " CREATED!");
                                                                    });
                                                                }
                                                            });
                                                    });
                                                }
                                            });
                                        });
                                }
                                i += 1;
                            });

                        },
                        function(){
                            alert("FAILED!");
                        }
                    );
                function(error){
                    console.log("EXTERNAL SD CARD NOT FOUND: " + error.code);
                    my.filesystem.root.getDirectory("G3", {create: true, exclusive:false},
                        function(dirEntry){
                            my.root = dirEntry;
                            console.log(dirEntry.name + " CREATED ON INTERNAL SDCARD");
                            deferred.resolve();
                        },
                        function(error){
                            console.error("INTERNAL getRootDirectory: " + error.code);
                        }
                    );
                }
            );*/

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
                    var sitesFile = new SitesFile();
                    sitesFile.fileEntry = fileEntry;
                    sitesFiles.push(sitesFile);
                });
                deferred.resolve(sitesFiles);
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
                deferred.resolve(JSON.parse(data));
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
            }, function(){
                deferred.reject();
            });
            return deferred.promise();
        };

        var getFile = function(fileEntry) {
            var deferred = new $.Deferred();
            fileEntry.file( function success(file) {
                deferred.resolve(file);
            }, function(){
                deferred.reject();
            });
            return deferred.promise();
        };

        var loadFile = function(file) {
            var deferred = new $.Deferred();
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                deferred.resolve(evt.target.result);
            };
            reader.readAsText(file);
            return deferred.promise();
        };

        my.fileExists = function(dirEntry, filename){
            var deferred = new $.Deferred();
            dirEntry.getFile(filename, {create: false},
                function(fileEntry){deferred.resolve(fileEntry)},
                function(){deferred.reject()}
            );
            return deferred.promise();
        };

        my.checkConnection = function(){
            return navigator.connection.type !== 'none';
        };

        var transferFail = function(error){
            console.log("Fail!");
            if (error.code === 3) {
                alert(Controller.errors.timeout);
            } else if (error.code !== 4) {
                alert(Controller.errors.upload);
                console.log(error.code);
            }
            if (Controller.gadget.sitesFiles().length > 0) {
                Controller.gadget.changeView('home');
            } else {
                Controller.gadget.exitApplication(Controller.errors.sites);
            }
        };

        my.downloadSites = function (fileTransfer, state, bidunit){
            var deferred = new $.Deferred();
            var uri = encodeURI(Controller.gadget.config().baseURL + "gadgetsites/" + state + "/" + bidunit + "?format=json");
            var filename = my.root.toURL() + makeFilename(state, bidunit);
            var requestTimeout = setTimeout(function(){
                var error = new FileTransferError();
                error.code = 3;
                transferFail(error);
                fileTransfer.abort();
                console.log("REQUEST CANCELLED");
            }, 30000);
            //getFileEntry(my.root, makeFilename(state, bidunit), {create: true, exclusive: false}).then(function(fileEntry){
            fileTransfer.download(
                uri,
                filename,
                function(entry) {
                    clearTimeout(requestTimeout);
                    console.log("G3 file downloaded; filename = " + filename + "; fileentry = " + entry.fullPath);
                    getFile(entry).then(loadFile).then(function(data) {
                        deferred.resolve();//JSON.parse(data));
                    });
                },
                function(error) {
                    clearTimeout(requestTimeout);
                    transferFail(error);
                    fileTransfer.abort();
                    deferred.reject();
                }
            );
            //});
            return deferred.promise();
        };

        my.uploadFile = function (fileTransfer, filePath, batch, filename){
            var deferred = new $.Deferred();
            console.log(filename);

            //var uploadedFile = initials + loadDate
            var uri = encodeURI(Controller.gadget.config().baseURL + "Upload/" + Controller.gadget.config().uploadURL + "/" + batch + "/" + filename);
            //var filePath = my.root.toURL() + "/" + my.activityLog;
            console.log(uri);
            var options = new FileUploadOptions();
            options.fileName = filename;
            //options.mimeType = "text/csv";

            function success(result){
                console.log("Success!");
                //console.log(result.response.code);
                deferred.resolve();
            };

            function fail(error){
                transferFail(error);
                fileTransfer.abort();
                deferred.reject();
            };

            fileTransfer.upload(filePath, uri, success, fail, options);

            return deferred.promise();
        };

        my.backUp = function(oldName, newName){
            var deferred = new $.Deferred();
            getFileEntry(my.root, oldName, {create: false, exclusive: false}).then(function(entry){
                my.root.getDirectory("Backups", {create: true, exclusive:false},
                    function(dirEntry){
                        entry.copyTo(dirEntry, newName,
                            function(entry){
                                deferred.resolve();
                            },
                            function(error){
                                deferred.reject();
                                alert("Back up error! Please contact technical support.");
                        });
                    },
                    function(error){
                        alert("Unable to access backup directory! Please contact technical support.");
                });
            });
            return deferred.promise();
        };

        my.deleteFile = function(dirEntry, filename){
            getFileEntry(dirEntry, filename, {create: false, exclusive: false}).then(
                function(entry){
                    entry.remove();
                    console.log("Removed " + filename);
                },
                function(){
                    console.log(filename + " not found!");
                }
            )
        };

        my.deleteLogs = function(){
            getFileEntry(my.root, my.activityLog, {create: false, exclusive: false}).then(function(entry){
                entry.remove(function(){console.log("Removed " + my.activityLog)});
                getFileEntry(my.root, my.trackLog, {create: false, exclusive: false}).then(function(entry) {
                    entry.remove(function(){console.log("Removed " + my.trackLog)});
                });
            });
        };

        my.deleteBackups = function(activityBackup, trackBackup){
            my.root.getDirectory("Backups", {create: false, exclusive: false}, function(dirEntry){
                getFileEntry(dirEntry, activityBackup, {create: false, exclusive: false}).then(function(entry){
                    entry.remove(function(){console.log("Removed " + activityBackup)});
                });
                getFileEntry(dirEntry, trackBackup, {create: false, exclusive: false}).then(function(entry) {
                    entry.remove(function(){console.log("Removed " + trackBackup)});
                });
            });
        };

        my.jobFile = function(filename){
            var deferred = new $.Deferred();
            getFileEntry(my.root, filename, {create: true, exclusive: false}).then(function(entry){
                writeFile(entry, Controller.gadget.config().email).then(
                   function(){
                       deferred.resolve();
                   },
                   function(){
                       alert("Unable to create job file!");
                       deferred.reject();
                   }
                );
            });
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

        my.logTrack = function(position){
            //var deferred = new $.Deferred();
            getFileEntry(my.root, my.trackLog, {create: true, exclusive: false}).then(function(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    writer.onwriteend = function(evt) {
                        //deferred.resolve();
                    };
                    writer.seek(writer.length);
                    if (writer.length === 0){
                        writer.write("lat,lon,date_time,fix\r\n");
                        //console.log("lat,lon,date_time,fix\r\n")
                    }
                    var trackDate = DateFormatter.getTrackDate(new Date(position.timestamp()));
                    writer.write(position.latitude() + "," + position.longitude() + "," + trackDate + "," + position.accuracy() + "\r\n");
                    //console.log(position.latitude() + "," + position.longitude() + "," + trackDate + "," + position.accuracy() + "\r\n");
                }, my.fail);
            });
            //return deferred.promise();
        };

        var readTransLog = function(){
            var deferred = new $.Deferred();
            getFileEntry(my.root, my.activityLog).then(getFile).then(loadFile).then(function(data){
                deferred.resolve(data);
            }).fail(function(){
                deferred.reject();
            });
            return deferred.promise();
        };

        my.getTransactions = function(){
            var deferred = new $.Deferred();
            readTransLog().then(function(data) {
                var history = [];
                var dataLines = data.split("\n");
                dataLines.pop();
                _.each(dataLines, function(line){
                    var properties = line.split(",");
                    var t = {
                        date: properties[8],
                        time: properties[9],
                        easting: properties[5],
                        northing: properties[6],
                        codedString: properties[12]
                    };
                    history.push(t);
                });
                deferred.resolve(history);
            }).fail(function(){
                deferred.resolve([]);
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