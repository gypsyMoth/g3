define(['jquery',
    'underscore',
    'knockout',
    'src/util/Geolocation',
    'src/util/Date',
    'src/util/Encoder',
    'src/util/NearestNeighbor',
    'src/viewmodels/Position',
    'src/viewmodels/Site',
    'src/viewmodels/Splash',
    'src/viewmodels/Home',
    'src/viewmodels/Placement',
    'src/viewmodels/Omit',
    'src/viewmodels/Confirm',
    'src/viewmodels/Caution',
    'src/viewmodels/ManualLock',
    'src/viewmodels/LoadSites'
], function($,
            _,
            ko,
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
            ManualLockView,
            LoadSitesView) {

    'use strict';

    var Gadget = function () {

        this.sitesFiles = ko.observableArray();

        this.manualLock = ko.observable(false);

        this.currentView = ko.observable('splash');

        this.selectedSite = ko.observable(new Site());

        this.position = ko.observable(new Position());

        this.sitesList = ko.observableArray();

        this.sitesList.subscribe(function(){
            Geolocation.findNearest(this.position().utm());
        }, this);

        this.nearestSites = ko.observableArray();

        this.operationalSite = ko.observable(new Site());

        this.initialize = function(){
            this.home = new HomeView();
            this.splash = new SplashView();
            this.splash.initializeGadget();
        };

        this.relativePosition = ko.observable();

        this.changeView = function(name){
            switch(name){
                case('home'):
                    this.operationalSite(new Site());
                    Geolocation.start();
                    break;
                case('placement'):
                    Geolocation.stop();
                    this.initializeOperation();
                    this.place = new PlacementView();
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
                    //alert(JSON.stringify(this.position().utm()));
                    //alert(JSON.stringify(this.selectedSite()));
                    //alert(JSON.stringify(this.nearestSites()));
                    break;
                case('manualLock'):
                    this.manual = new ManualLockView();
                    break;
                case('loadSites'):
                    this.loadSites = new LoadSitesView();
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

        this.codedString = function() {
            var op = this.operationalSite();

            var ret = Encoder.transactionLog.BANG + ',';
            ret += Encoder.transactionLog.ROW + ',';
            ret += Encoder.transactionLog.MESSAGE + ',';
            ret += op.zone + ',';
            ret += Encoder.transactionLog.HEMISPHERE + ',';
            ret += op.xact + ',';
            ret += op.yact + ',';
            ret += Encoder.rpad((this.position().accuracy() + '.'), 5, '0') + ',';
            ret += DateFormatter.getOperationFormatDate(op.txn_date) + ',';
            ret += DateFormatter.getOperationFormatTime(op.txn_date) + ',';
            ret += Encoder.transactionLog.PLACEHOLDER + ',';
            ret += Encoder.transactionLog.ZERO + ',';
            ret += Encoder.padQuad(op.quad) + Encoder.padSite(op.site_id);

            if (op.visit) {
                ret += Encoder.visitCode(op.visit);
                ret += Encoder.conditionCode(op.condition);
                if ((op.condition === 'GOOD' || op.condition === 'DAMAGED') && !(op.pass_fail)) {
                    ret += Encoder.padCatch(op.catch);
                }
                if (op.pass_fail) {
                    if ((op.condition === 'MISSING') || (op.condition === 'INACCESSIBLE')) {
                        ret += ' ';
                    } else {
                        ret += Encoder.transactionLog.ZERO;
                    }
                    ret += Encoder.passCode(op.pass_fail);
                    if (op.fail_reason !== 'Passed') {
                        ret += Encoder.failReasonCode(op.fail_reason);
                    }
                }
            } else if (op.omit_reason) {
                ret += 'O' + Encoder.getCode(op.omit_reason, Encoder.omitReasons);
            } else {
                ret += op.traptype === 'Delta' ? 'D' : 'M';
                ret += this.relativePosition().distanceOutside > 0 ? 'B' : '';
            }
            ret += ',' + Encoder.transactionLog.DOLLAR;
            ret += '\r\n';
            return ret;
        }
    };

    return Gadget;
});
