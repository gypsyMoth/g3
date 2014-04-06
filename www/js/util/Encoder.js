define (function () { 'use strict';
    var my = {};

    my.transactionLog = {
        "BANG": "#",
        "ROW": "000",
        "MESSAGE": "01234567890123",
        "HEMISPHERE": "North",
        "PLACEHOLDER": "",
        "ZERO": "0",
        "DOLLAR": "$"
    };

    my.operationTypes = {
        ERROR: 'ERROR',
        UNADDRESSED: 'UNADDRESSED',
        PLACED: 'PLACED',
        OMITTED: 'OMITTED',
        MIDSEASON: 'MIDSEASON',
        FINAL: 'FINAL'
    };

    my.getString = function(currentPosition) {
        var ret = my.constants.BANG;
        ret += my.constants.ROW;
        ret += my.constants.MESSAGE;
        ret += my.constants.HEMISPHERE;
    };

    my.padSite = function(site) {
        return this.lpad(site.toString(), 4, '0');
    };

    my.padQuad = function(quad) {
        return this.rpad(quad, 5, ' ');
    };

    my.rpad = function (string, width, padding) {
        return (width <= string.length) ? string : this.rpad(string + padding, width, padding);
    };

    my.lpad = function (string, width, padding) {
        return (width <= string.length) ? string : this.lpad(padding + string, width, padding);
    };

    return my;

});
