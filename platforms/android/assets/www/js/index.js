
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

    getSitesFile: function(file) {
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.onFileSystemSuccess, this.fail);
    },

    onFileSystemSuccess: function(fileSystem) {
        window.rootFS = fileSystem.root;

        // Get a directory reader
        var directoryReader = fileSystem.root.createReader();

        // Get a list of all the entries in the directory
        directoryReader.readEntries(app.onDirectoryReaderSuccess, app.fail);

        //Sites.Load(window.rootFS.fullPath + "www/db/wv_1.json");
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
        this.fail,
        {enableHighAccuracy:true, timeout:1000, maximumAge:0 });
    },

    fail: function (error) {
        var element = document.getElementById('locationSpan');
        var msg = 'code: ' + error.code + '\n' + 'message: ' + error.message + '\n';
        element.innerHTML = msg;
        console.log(msg);
    }
};
