define(['jquery',
    'underscore',
    'knockout',
    'src/util/Controller',
    'src/util/Geolocation',
    'src/util/NearestNeighbor',
    'src/util/Date',
    'src/util/Encoder'
], function($,
            _,
            ko,
            Controller,
            Geolocation,
            NearestNeighbor,
            DateFormatter,
            Encoder
    ) {

    'use strict';

    var HomeView = function() {

        var watchId = null;

        this.current = ko.computed(function(){
            return Controller.gadget.position();
        });

        this.found = ko.computed(function(){
            return this.current().timestamp() !== undefined;
        }, this);

        this.site = ko.computed(function(){
            return Controller.gadget.selectedSite();
        });

        this.foundSite = ko.computed(function(){
            return JSON.stringify(this.site()) !== '{}';
        }, this);

        this.gpsStatus = ko.observable(false);

        this.now = ko.observable(Date.now());

        this.gpsAge = ko.computed(function(){
            var timestamp = this.current().timestamp() || 0;
            var age = this.now() - timestamp;
            return age <= 0 ? 0 : Math.floor(age/1000);
        }, this);

        this.signalCount = ko.computed(function(){
            if (this.gpsAge() > 20) {
                this.gpsStatus(false);
                return '100%';
            } else {
                this.gpsStatus(true);
                var counter =  (20 - this.gpsAge()) * 5;
                return counter + '%'
            }
        }, this);

        this.location = ko.computed(function(){
            return this.current().utm().Zone + ", " + this.current().utm().Easting + "E, " + this.current().utm().Northing + "N";
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
            //Added this unnecessary if statement to keep the navigator from breaking jasmine spec tests...
            if (navigator.notification !== undefined) {
                navigator.notification.beep(1);
            }
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
            var imagePath = 'img/';
            if (this.site().omit_reason) {
                imagePath += 'omittedTree';
            } else {
                imagePath += this.color();
                imagePath += this.imageType();
            }
            imagePath += '.png';
            return imagePath;
        }, this);

        this.siteInfo = ko.computed(function(){
            if (this.foundSite()) {
                return this.site().quad + ":"  + this.site().site_id;
            } else {
                return "NO SITE";
            }
        }, this);

        var conversion = function(meters){
            var dist, units;
            if (Controller.gadget.config().metric === false){
                dist = meters > 1609.34 ? Math.round(meters/1609.34*10)/10 : Math.round(meters * 1.09361);
                units = meters > 1609.34 ? "mi" : "yd";
            } else {
                dist = meters > 1000 ? Math.round(meters/1000*10)/10 : meters;
                units = meters > 1000 ? "km" : "m";
            }
            return dist + " " + units;
        };

        this.positionInfo = ko.computed(function(){
            if (this.gpsStatus() === false) {
                return "Acquiring Satellites..."
            } else if (!this.foundSite()) {
                return "No sites found in Zone " + this.current().utm().Zone + "!";
            } else {
                var distance = conversion(this.relPos().distance);
                var accuracy = conversion(this.current().accuracy());
                return distance + " (\xB1" + accuracy + ") " + this.relPos().bearing;
            }
        }, this);

        this.heading = ko.observable(0);

        this.bearing = ko.observable(0);

        this.startCompass = function(){
            var options = {
                frequency: 100
            };
            console.log("Starting Compass!");
            var myHeading = this.heading;
            watchId = navigator.compass.watchHeading(
                function(heading){
                    myHeading(Math.round(heading.magneticHeading));
                },
                function(error) {
                    console.log(error.code);
                },
                options
            );
        };

        this.cardinalRotation = ko.computed(function(){
            var rotation = 360 - this.heading();
            return 'translate(-50%, -50%) rotate(' + rotation + 'deg)';
        }, this);

        this.arrowRotation = ko.computed(function(){
            var rotation = this.relPos().compassBearing - this.heading();
            if (rotation < 0) {
                rotation += 360;
            }
            return 'translate(-50%, -50%) rotate(' + rotation + 'deg)';
        }, this);

        this.operationType = function(){
            var site = this.site();
            var operationType = '';
            if (site.quad === undefined) {
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
                    if (DateFormatter.getOperationFormatDate(this.site().txn_date) === DateFormatter.getOperationFormatDate(Date.now()) && (this.site().fail_reason === undefined)) {
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
                        } else if (this.site().fail_reason === undefined){
                            msg = "A " + this.site().visit + " Inspection was done for this trap on " + date;
                        } else {
                            msg = "A QC Inspection was done for this trap on " + date;
                        }
                    }
                }
            }
            return msg;
        }, this);

        this.goToView = function(view){
            console.log("FOUND SITE: " + this.foundSite());
            clearInterval(this.timer);
            navigator.compass.clearWatch(watchId);
            Controller.gadget.changeView(view);
        };

    };

    return HomeView;

});
