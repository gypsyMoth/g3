define (['moment'], function (moment) { 'use strict';

    var my = {};

    my.getSitesFormatDate = function(date) {
        return moment(date).format('YYYY-MM-DD') + 'T' + moment(date).format('HH:mm:ss') + '-00:00';
    };

    my.getScreenFormatDate = function(dateString) {
        return moment(dateString.substring(0,10), 'YYYY-MM-DD').format('M/DD/YY');
    };

    my.getOperationFormatDate = function(date) {
        return moment(date).format('MMM-DD-YYYY');
    };

    my.getOperationFormatTime = function(dateString) {
        return moment(dateString.substring(0,19), 'YYYY-MM-DDTHH:mm:ss').format('HH:mm:ss');
    }

    my.getLoadFormatDate = function(date) {
        return moment(date).format('MMDD');
    };

    my.getBatchDate = function(date) {
        return moment(date).format('MMDDHHmmssSSS');
    }

    my.getTrackDate = function(date) {
        return moment(date).format('M/D/YY h:mm:ss A');
    }



    return my;
});
