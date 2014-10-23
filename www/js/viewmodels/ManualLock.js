define(['jquery',
    'knockout',
    'src/util/DB',
    'src/util/Geolocation',
    'src/util/Encoder',
    'src/util/Controller'
], function($,
            ko,
            DB,
            Geolocation,
            Encoder,
            Controller
    ) {

    'use strict';

    var ManualLockView = function() {

        this.site = Controller.gadget.selectedSite();

        this.selectedLock = ko.observable();

        this.lockOptions = ko.computed(function(){
            var sites = Controller.gadget.nearestSites();
            var array = []
            for (var i = 0; i < sites.length; i++){
                var obj = {};
                obj.site = sites[i];
                obj.label = sites[i].quad + ":" + sites[i].site_id;
                if (sites[i].quad !== undefined) {
                    array.push(obj);
                }
            }
            var disable = {site:{},label:'Disable Manual Lock'};
            array.push(disable);
            this.selectedLock(disable);
            return array;
        }, this);

        this.goHomeManual = function(){
            if (this.selectedLock().label !== 'Disable Manual Lock'){
                Controller.gadget.selectedSite(this.selectedLock().site);
                Controller.gadget.manualLock(true);
                alert("You will now be locked exclusively on " + this.selectedLock().label + "!");
            } else {
                Controller.gadget.manualLock(false);
                Geolocation.findNearest(Controller.gadget.position().utm());

            }
            Controller.gadget.changeView('home');
        };
    };

    return ManualLockView;

});
