define (['moment'], function (moment) { 'use strict';

    var my = {};

    my.getSitesFormatDate = function(date) {
        return moment(date).format('YYYY-MM-DD') + 'T00:00:00-00:00';
    };

    my.getScreenFormatDate = function(dateString) {
        return moment(dateString.substring(0,10), 'YYYY-MM-DD').format('MM/DD/YY');
    };

    my.getOperationFormatDate = function(date) {
        return moment(date).format('MMM-DD-YYYY');
    };

    return my;
});
