
var app = {
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
        //app.startGeolocation();
    },

    testFile: "wv_1.json",

    getSitesFile: function(file) {
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.onFileSystemSuccess, app.fail);
    },

    onFileSystemSuccess: function(fileSystem) {
        window.rootFS = fileSystem.root;

        //Read in a data file
        fileSystem.root.getFile(app.testFile, { create: false }, app.loadLocal, app.fileDoesNotExist);
    },

    loadLocal: function (fileEntry){
        var msg = "Loading " + fileEntry.name + " from local...";
        console.log(msg);
        var element = document.getElementById('locationSpan');
        element.innerHTML = msg;

        var reader = new FileReader();
        reader.onloadend = function(evt) {
            Sites.List = JSON.parse(event.target.result);
        };
        reader.readAsText(fileEntry.fullPath);
    },

    fileDoesNotExist: function (){
        var msg = "Downloading sites...";
        console.log(msg);
        var element = document.getElementById('locationSpan');
        element.innerHTML = msg;

        var fileTransfer = new FileTransfer();
        var uri = encodeURI("http://yt.ento.vt.edu/SlowTheSpread/gadgetsites/WV/1");

        fileTransfer.download(
            uri,
            app.testFile,
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

    onDirectoryReaderSuccess: function(entries) {
        var i;
        for (i = 0; i < entries.length; i++) {
            console.log(entries[i].name);
        }
    },

    startGeolocation: function() {
        var watchId = navigator.geolocation.watchPosition(function (position) {
            var element = document.getElementById('locationSpan');
            var p = CoordinateConverter.datumShift({ Lon:position.coords.longitude, Lat:position.coords.latitude});
            var utm = CoordinateConverter.project(p);
            element.innerHTML = utm.Easting + 'E, ' + utm.Northing + 'N (' + utm.Zone + ')';
            var nearestSite = Sites.Nearest(utm);
            element = document.getElementById('siteSpan');
            element.innerHTML = nearestSite.quad + ':' + nearestSite.site_id;
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
