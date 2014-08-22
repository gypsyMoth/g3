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

    my.visitCode = function(fullText) {
      var code = '';
      switch(fullText) {
          case "MIDSEASON":
              code = "M";
              break;
          case "FINAL":
              code = "F";
              break;
      }
      return code;
    };

    my.conditionCode = function(fullText) {
        var code = '';
        switch(fullText){
            case "GOOD":
                code = "G";
                break;
            case "DAMAGED":
                code = "D";
                break;
            case "MISSING":
                code = "M";
                break;
            case "INACCESSIBLE":
                code ="I";
                break;
        }
        return code;
    };

    my.passCode = function(fullText) {
        if (fullText === "Failed") {
            return "F"
        } else {
            return "P"
        }
    };

    my.failReasonCode = function(fullText) {
        var code = '';
        switch(fullText){
            case('The trap is not assembled correctly'):
                code = 'A';
                break;
            case('Trap placed outside target circle'):
                code = 'C';
                break;
            case('Directions to the site are incorrect or incomplete'):
                code = 'D';
                break;
            case('Grid set at wrong spacing'):
                code = 'G';
                break;
            case('Trap info not recorded correctly on trap'):
                code = 'I';
                break;
            case('Record filled out, no trap set (bogus data)'):
                code = 'R';
                break;
            case('Delta trap set where milk carton indicated'):
                code = 'T';
                break;
            case('UTMs recorded incorrectly on data sheet'):
                code = 'U';
                break;
            case('Trapper did not remove trap from field'):
                code = 'X';
                break;
            case('Multiple traps set at one site'):
                code = 'M';
                break;
            case('Trap set too low to ground'):
                code = 'S';
                break;
            case('Inspection incorrectly done'):
                code = 'W';
                break;
            default:
                break;
        }
        return code;
    };


    my.padSite = function(site) {
        return this.lpad(site.toString(), 4, '0');
    };

    my.padCatch = function(moths) {
        return this.lpad(moths.toString(), 3, '0');
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
