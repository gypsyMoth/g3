/*Created by Ian on 1/15/14.*/

app.DB = (function () {
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
        fileEntry.file(gotFile, app.fail);
    };

    var gotFile = function(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            Sites.List = JSON.parse(evt.target.result);
        };
        reader.readAsText(file);
    };

    var fileDoesNotExist = function (){
        var fileTransfer = new FileTransfer();
        var uri = encodeURI("http://yt.ento.vt.edu/SlowTheSpread/gadgetsites/" + state + "/" + bidunit + "?format=json");

        fileTransfer.download(
            uri,
            app.AppHome.fullPath + "/" + app.testFile,
            function(entry) {
                loadLocal(entry);
            }, app.fail
        );
    };
}());