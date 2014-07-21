define(['jquery',
    'knockout',
    'src/util/Controller',
    'src/util/Geolocation',
    'src/util/NearestNeighbor',
    'src/util/Date'
], function($,
            ko,
            Controller,
            Geolocation,
            NearestNeighbor,
            DateFormatter
    ) {

    'use strict';

    var HomeView = function() {

        this.current = ko.computed(function(){
            return Controller.gadget.position();
        });

        this.site = ko.computed(function(){
            /*var thisSite = Controller.viewModel.selectedSite();
            thisSite.xth(551107);
            thisSite.yth(4119844);
            thisSite.grid(100);
            thisSite.quad('FIREH');
            thisSite.site_id(1);
            return thisSite;*/
            return Controller.gadget.selectedSite();
        });

        this.location = ko.computed(function(){
            return this.current().utm().Zone + ", " + this.current().utm().Easting + "E, " + this.current().utm().Northing + "N"
        }, this);

        this.inspected = ko.computed(function(){
            return this.site().visit;
        }, this);

        this.isOut = ko.observable(false);

        this.relativePosition = ko.computed(function(){
            var rp = NearestNeighbor.relativePosition(this.site(), this.current().utm());
            rp.distanceOutside > 0 ? this.isOut(true) : this.isOut(false);
            return rp;
            //return NearestNeighbor.relativePosition(this.site(), this.current().utm());
        }, this);

        this.isOut.subscribe(function(){
            navigator.notification.beep(1);
        }, this);

        this.color = ko.computed(function(){
            if (this.isOut()){
                return 'red';
            } else {
                return 'green';
            }
        }, this);

        this.imageType = ko.computed(function(){
            if (this.site().xact === undefined) {
                return 'Tree';
            } else {
                return this.site().trap_type === 'Delta' ? 'Delta' : 'MilkCarton';
            }
        }, this);

        this.image = ko.computed(function(){
            var imagePath = 'img/'
            if (this.site().omit_reason) {
                imagePath += 'omittedTree';
            } else {
                imagePath += this.color();
                imagePath += this.imageType();
            }
            imagePath += '.gif';
            return imagePath;
        }, this);

        this.siteInfo = ko.computed(function(){
            if (JSON.stringify(this.site()) === '{}') {
                return "NO SITE";
            } else {
                return this.site().quad + " "  + this.site().site_id;
            }
        }, this);

        this.positionInfo = ko.computed(function(){
            if (this.relativePosition().distance) {
                return this.relativePosition().distance + " (\xB1" + this.current().accuracy() + ") meters " + this.relativePosition().bearing;
            } else {
                return "No sites found in Zone " + this.current().utm().Zone + "!";
            }
        }, this);

        this.message = ko.computed(function(){
            var msg;
            if (JSON.stringify(this.site()) === '{}'){
                msg = '';
            } else  {
                if (this.site().xact === undefined){
                    msg = "No trap at this site!"
                } else {
                    var date = DateFormatter.getScreenFormatDate(this.site().txn_date);
                    if (this.site().trap_type === 'Omit'){
                        msg = "This trap was omitted on " + date;
                    } else {
                        if (this.site().visit === undefined){
                            msg = "This trap was placed on " + date;
                        } else if (this.site().passFail === undefined){
                            msg = "This trap was " + this.site().visit + " inspected on " + date;
                        } else {
                            msg = "This trap was QC inspected on " + date;
                        }
                    }
                }
            }
            return msg;
        }, this);

    };

    return HomeView;

});
