define(['jquery',
    'knockout',
    'src/models/Site',
    'src/util/Geolocation',
    'src/util/Controller'
], function($,
            ko,
            Site,
            Geolocation,
            Controller
    ) {

    'use strict';

    var RandomView = function() {

        this.randomSite = new Site();

        this.startRandom = function(){
            Controller.gadget.manualLock(false);
            var pos = Controller.gadget.position().utm();
            this.randomSite.zone = pos.Zone;
            this.randomSite.xth = pos.Easting;
            this.randomSite.yth = pos.Northing;
            this.randomSite.site_id = Geolocation.getNextRandomSiteId();
            this.randomSite.quad = 'RANDM';
            this.randomSite.trap_type = 'Milk Carton';
            this.randomSite.grid = 100;
            Controller.gadget.selectedSite(this.randomSite);
            Controller.gadget.changeView('placement');
        };
    };

    return RandomView;

});
