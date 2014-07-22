define(['jquery',
    'knockout',
    'src/util/Controller',
    'src/util/Geolocation',
    'src/util/NearestNeighbor',
    'src/util/Date',
    'src/util/Encoder'
], function($,
            ko,
            Controller,
            Geolocation,
            NearestNeighbor,
            DateFormatter,
            Encoder
    ) {

    'use strict';

    var HomeView = function() {

        this.current = ko.computed(function(){
            return Controller.gadget.position();
        });

        this.site = ko.computed(function(){
            return Controller.gadget.selectedSite();
        });

        this.location = ko.computed(function(){
            return this.current().utm().Zone + ", " + this.current().utm().Easting + "E, " + this.current().utm().Northing + "N"
        }, this);

        this.inspected = ko.computed(function(){
            return this.site().visit;
        }, this);

        this.isOut = ko.observable(false);

        this.relPos = ko.computed(function(){
            var rp = NearestNeighbor.relative(this.site(), this.current().utm());
            rp.distanceOutside > 0 ? this.isOut(true) : this.isOut(false);
            Controller.gadget.relativePosition(rp);
            return rp;
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
            if (this.relPos().distance) {
                return this.relPos().distance + " (\xB1" + this.current().accuracy() + ") meters " + this.relPos().bearing;
            } else {
                return "No sites found in Zone " + this.current().utm().Zone + "!";
            }
        }, this);

        this.operationType = function(){
            var site = this.site();
            var operationType = '';
            if (site.quad === '') {
                operationType = Encoder.operationTypes.ERROR;
            } else if (typeof site.xact === 'undefined') {
                operationType = Encoder.operationTypes.UNADDRESSED;
            } else if (typeof site.visit === 'undefined') {
                if (typeof site.omit_reason === 'undefined') {
                    operationType = Encoder.operationTypes.PLACED;
                } else {
                    operationType = Encoder.operationTypes.OMITTED;
                }
            } else if (site.visit === 'MIDSEASON') {
                operationType = Encoder.operationTypes.MIDSEASON;
            } else {
                operationType = Encoder.operationTypes.FINAL;
            }
            return operationType;
        };

        this.operation = function(){
            switch (this.operationType()) {
                case Encoder.operationTypes.ERROR:
                    break;
                case Encoder.operationTypes.UNADDRESSED:
                    return'placement';
                    break;
                case Encoder.operationTypes.PLACED:
                case Encoder.operationTypes.MIDSEASON:
                    if (this.site().txn_date === DateFormatter.getSitesFormatDate(Date.now()) && (this.site().passFail === undefined)) {
                        alert("Site cannot be placed and inspected or inspected multiple times on the same day!");
                    } else {
                        if (this.relPos().distance > 100) {
                            alert("Inspections cannot be completed from more than 100 meters away. This may be due to GPS error now or during placement.");
                        } else {
                            return 'inspection';
                        }
                    }
                    break;
                case Encoder.operationTypes.FINAL:
                    alert("Final inspection has been completed!");
                    break;
                case Encoder.operationTypes.OMITTED:
                    alert("Site omitted!");
                    break;
            }
        };

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
                            msg = "A " + this.site().visit + " inspection was done for this trap on " + date;
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
