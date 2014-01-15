
var app = {

    AppHome: "",
    testFile: "wv_1.json",

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        var element = document.getElementById('locationSpan');
        element.innerHTML = "Loading sites...";
        app.getSitesFile();
        element.innerHTML = "Acquiring satellites...";
        app.startGeolocation();
    },

    getSitesFile: function(file) {
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.onFileSystemSuccess, app.fail);
    },

    onFileSystemSuccess: function(fileSystem) {
        window.rootFS = fileSystem.root;

        //Get app directory
        fileSystem.root.getDirectory("com.phonegap.g3", {create: true }, app.gotApplicationDirectory, app.fail);
    },

    gotApplicationDirectory: function(dirEntry) {
        //Read in a data file
        app.AppHome = dirEntry;
        dirEntry.getFile(app.testFile, { create: false }, app.fileDoesNotExist, app.fileDoesNotExist);
    },

    loadLocal: function (fileEntry){
        var msg = "Loading " + fileEntry.name + " from local...";
        console.log(msg);
        var element = document.getElementById('locationSpan');
        element.innerHTML = msg;

        fileEntry.file(app.gotFile, app.fail);
    },

    gotFile: function(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log(evt.target.result);
            Sites.List = JSON.parse(evt.target.result);
        };
        reader.readAsText(file);
    },

    fileDoesNotExist: function (){
        var msg = "Downloading sites...";
        console.log(msg);
        var element = document.getElementById('locationSpan');
        element.innerHTML = msg;

        var fileTransfer = new FileTransfer();
        var uri = encodeURI("http://yt.ento.vt.edu/SlowTheSpread/gadgetsites/WV/1?format=json");

        fileTransfer.download(
            uri,
            app.AppHome.fullPath + "/" + app.testFile,
            function(entry) {
                console.log("download complete: " + entry.fullPath);
                app.loadLocal(entry);
            },
            function(error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code" + error.code);
            }
        );
    },

    startGeolocation: function() {
        var watchId = navigator.geolocation.watchPosition(function (position) {

            var p = CoordinateConverter.datumShift({ Lon:position.coords.longitude, Lat:position.coords.latitude});
            var utm = CoordinateConverter.project(p);
            var e = document.getElementById('locationSpan');
            e.innerHTML = utm.Zone + ', ' + utm.Easting + 'E, ' + utm.Northing + 'N';

                var nearest = Sites.Nearest(utm);
            if (nearest.Found) {
                e = document.getElementById('siteSpan');
                e.innerHTML = nearest.Site.quad + ':' + nearest.Site.site_id;
                e = document.getElementById('distanceSpan');
                e.innerHTML = "Distance: " + nearest.Distance + " meters";
            } else {
                e = document.getElementById('siteSpan');
                e.innerHTML = "No sites found";
                e = document.getElementById('distanceSpan');
                e.innerHTML = "";
            }
        },
        app.fail,
        {enableHighAccuracy:true, timeout:1000, maximumAge:0 });
    },

    fail: function (error) {
        var element = document.getElementById('locationSpan');
        var msg = 'code: ' + error.code + '\n' + 'message: ' + error.message + '\n';
        element.innerHTML = msg;
        console.log(msg);
    }
};
