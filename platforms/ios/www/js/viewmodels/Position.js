define(['knockout',
        'src/util/CoordinateConverter'
], function(ko,
            CoordinateConverter
    ) {

    'use strict';

    var Position = function() {

        this.latitude = ko.observable();
        this.longitude = ko.observable();
        this.accuracy = ko.observable();
        this.timestamp = ko.observable();
        this.utm = ko.computed(function(){
            var p = CoordinateConverter.datumShift({ Lon: this.longitude(), Lat: this.latitude()});
            return CoordinateConverter.project(p);
        }, this);

    };

    return Position;

});
