/**
 * Created by Ian on 1/15/14.
 */

var DB = (function () {
    var my = {};

    var state = '';
    var bidunit = null;

    var filename = function() {
      return state + "_" + bidunit + ".json";
    };

    my.getSites = function(state, bidunit) {
        state = state;
        bidunit = bidunit;
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, app.fail);
    };

    var onFileSystemSuccess = function(fileSystem) {
        window.rootFS = fileSystem.root;

        //Get app directory
        fileSystem.root.getDirectory("com.phonegap.g3", {create: true }, gotApplicationDirectory, app.fail);
    };

    var gotApplicationDirectory = function(dirEntry) {
        //Read in a data file
        app.AppHome = dirEntry;
        dirEntry.getFile(filename, { create: false }, fileDoesNotExist, fileDoesNotExist);
    };

    var loadLocal = function (fileEntry){
//        var msg = "Loading " + fileEntry.name + " from local...";
//        console.log(msg);
//        var element = document.getElementById('locationSpan');
//        element.innerHTML = msg;

        fileEntry.file(gotFile, app.fail);
    };

    var gotFile = function(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
//            console.log(evt.target.result);
            Sites.List = JSON.parse(evt.target.result);
        };
        reader.readAsText(file);
    };

    var fileDoesNotExist = function (){
//        var msg = "Downloading sites...";
//        console.log(msg);
//        var element = document.getElementById('locationSpan');
//        element.innerHTML = msg;

        var fileTransfer = new FileTransfer();
        var uri = encodeURI("http://yt.ento.vt.edu/SlowTheSpread/gadgetsites/" + state + "/" + bidunit + "?format=json");

        fileTransfer.download(
            uri,
            app.AppHome.fullPath + "/" + app.testFile,
            function(entry) {
//                console.log("download complete: " + entry.fullPath);
                loadLocal(entry);
            }, app.fail
        );
    };
}());