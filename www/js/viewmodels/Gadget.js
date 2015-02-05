define(['jquery',
    'underscore',
    'knockout',
    'src/util/DB',
    'src/util/Geolocation',
    'src/util/Date',
    'src/util/Encoder',
    'src/util/NearestNeighbor',
    'src/viewmodels/Position',
    'src/models/Site',
    'src/viewmodels/Splash',
    'src/viewmodels/Home',
    'src/viewmodels/Placement',
    'src/viewmodels/Omit',
    'src/viewmodels/Confirm',
    'src/viewmodels/Caution',
    'src/viewmodels/Extras',
    'src/viewmodels/ManualLock',
    'src/viewmodels/LoadSites',
    'src/viewmodels/Random',
    'src/viewmodels/History',
    'src/viewmodels/Inspection',
    'src/viewmodels/QC',
    'src/viewmodels/Download',
    'src/viewmodels/Upload',
    'src/viewmodels/Settings',
    'src/models/Config'
], function($,
            _,
            ko,
            DB,
            Geolocation,
            DateFormatter,
            Encoder,
            NearestNeighbor,
            Position,
            Site,
            SplashView,
            HomeView,
            PlacementView,
            OmitView,
            ConfirmView,
            CautionView,
            ExtrasView,
            ManualLockView,
            LoadSitesView,
            RandomView,
            HistoryView,
            InspectionView,
            QCView,
            DownloadView,
            UploadView,
            SettingsView,
            Config) {

    'use strict';

    var Gadget = function () {

        this.config = ko.observable(new Config());
        // Configuration options...
        this.initials = ko.observable('BGP');

        this.state = ko.observable('VA');

        this.email = ko.observable('bgpogue@vt.edu');

        this.metric = ko.observable(true);

        this.compass = ko.observable(true);

        this.magneticCompass = ko.observable(true);

        this.track = ko.observable(true);

        this.directUpload = ko.observable(false);

        // Application objects...
        this.sitesFiles = ko.observableArray();

        this.manualLock = ko.observable(false);

        this.currentView = ko.observable('splash');

        this.selectedSite = ko.observable(new Site());

        this.position = ko.observable(new Position());

        this.previousUTMs = ko.observableArray();

        this.previousUTM = ko.computed(function(){
            var east = 0;
            var north = 0;
            var n = this.previousUTMs().length;
            var zone = this.selectedSite().zone;
            _.each(this.previousUTMs(), function(utm){
                east += utm.Easting;
                north += utm.Northing;
            });
            var avgUTM = {
                Zone: zone,
                Easting: Math.round(east/n),
                Northing: Math.round(north/n)
            };
            return avgUTM;
        }, this);

        this.sitesList = ko.observableArray();

        this.sitesList.subscribe(function(){
            Geolocation.findNearest(this.position().utm());
        }, this);

        this.bidUnitList = ko.observableArray();

        this.nearestSites = ko.observableArray();

        this.operationalSite = ko.observable(new Site());

        this.initialize = function(){
            this.splash = new SplashView();
            this.home = new HomeView();
            this.splash.initializeGadget();
        };

        this.relativePosition = ko.observable();

        this.connectionStatus = ko.observable(false);

        this.changeView = function(name){
            switch(name){
                case('home'):
                    this.home.timer = setInterval(_.bind(function(){
                        this.home.now(Date.now());
                    }, this), 1000);
                    this.operationalSite(new Site());
                    if (this.config().compass){
                        this.home.startCompass();
                    };
                    Geolocation.start();
                    break;
                case('placement'):
                    Geolocation.stop();
                    this.initializeOperation();
                    this.place = new PlacementView();
                    break;
                case('inspection'):
                    Geolocation.stop();
                    this.initializeOperation();
                    this.inspection = new InspectionView();
                    break;
                case('omit'):
                    this.omit = new OmitView();
                    break;
                case('caution'):
                    this.caution = new CautionView();
                    break;
                case('confirm'):
                    this.confirm = new ConfirmView();
                    break;
                case('extras'):
                    Geolocation.stop();
                    this.connectionStatus(DB.checkConnection());
                    this.extras = new ExtrasView();
                    //var config = this.config();
                    //alert(config.state + " " + config.initials + " " + config.email + " " + config.metric + " " + config.compass + " " + config.track+ " " + config.directUpload);
                    break;
                case('manualLock'):
                    this.manual = new ManualLockView();
                    break;
                case('loadSites'):
                    this.loadSites = new LoadSitesView();
                    break;
                case('random'):
                    this.random = new RandomView();
                    break;
                case('qcInspection'):
                    this.initializeOperation();
                    this.qc = new QCView();
                    break;
                case('history'):
                    break;
                case('download'):
                    this.download = new DownloadView();
                    this.download.loadBidUnits();
                    break;
                case('upload'):
                    this.upload = new UploadView();
                    break;
                case('settings'):
                    this.settings = new SettingsView();
                    break;
            }
            this.currentView(name);
        };

        this.initializeOperation = function(){
            var op = this.operationalSite();
            var site = this.selectedSite();
            op.zone = site.zone;
            op.xth = site.xth;
            op.yth = site.yth;
            op.xact = this.position().utm().Easting;
            op.yact = this.position().utm().Northing;
            op.quad = site.quad;
            op.site_id = site.site_id;
            op.grid = site.grid;
            op.trap_type = site.trap_type;
            op.txn_date = DateFormatter.getSitesFormatDate(Date.now());
        };

        this.exitApplication = function(message) {
            alert(message);
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        };
    };

    return Gadget;
});
