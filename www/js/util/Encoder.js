define (['src/util/Date',
         'src/util/Controller'
],  function (DateFormatter,
              Controller
    ) {

    'use strict';

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

    my.omitReasons = [
        {value: 'H', label:'Nothing to hang trap on', text:'No structure on which to hang trap'},
        {value: 'L', label:'Landowner denied access', text:'Landowner denied access'},
        {value: 'O', label:'Obstacle prohibited access', text:'Obstacle prohibited access'},
        {value: 'W', label:'Too wet', text:'Inaccessible terrain - too wet'},
        {value: 'R', label:'Too rough or steep', text:'Inaccessible terrain - too rough or steep'},
        {value: 'V', label:'Vegetation too thick', text:'Inaccessible terrain - vegetation too thick'},
        {value: 'S', label:'Safety hazard', text:'Safety hazard'}
    ];

    my.conditions = [
        {value: 'G', label:'Good', text:'GOOD'},
        {value: 'D', label:'Damaged', text:'DAMAGED'},
        {value: 'M', label:'Missing', text:'MISSING'},
        {value: 'I', label:'Inaccessible', text:'INACCESSIBLE'}
    ];

    my.visits = [
        {value: 'M', label:'Midseason', text:'MIDSEASON'},
        {value: 'F', label:'Final', text:'FINAL'}
    ];

    my.failReasons = [
        {value:'P', label:'Passed',text:'Passed'},
        {value:'A', label:'Trap not assembled correctly',text:'Trap not assembled correctly'},
        {value:'C', label:'Trap placed outside target circle',text:'Trap placed outside target circle'},
        {value:'D', label:'Directions to the site are incorrect or incomplete',text:'Directions to the site are incorrect or incomplete'},
        {value:'G', label:'Grid set at wrong spacing',text:'Grid set at wrong spacing'},
        {value:'I', label:'Trap info not recorded correctly on trap',text:'Trap info not recorded correctly on trap'},
        {value:'R', label:'Record filled out, no trap set',text:'Record filled out, no trap set'},
        {value:'T', label:'Wrong trap type',text:'Wrong trap type'},
        {value:'U', label:'UTMs recorded incorrectly on data sheet',text:'UTMs recorded incorrectly on data sheet'},
        {value:'X', label:'Trapper did not remove trap from field',text:'Trapper did not remove trap from field'},
        {value:'M', label:'Multiple traps set at one site',text:'Multiple traps set at one site'},
        {value:'S', label:'Trap set too low to ground',text:'Trap set too low to ground'},
        {value:'W', label:'Incorrect inspection',text:'Incorrect inspection'}
    ];

    my.getText = function(code, array){
        for (var i = 0; i < array.length; i++){
            if (array[i].value === code) {
                return array[i].text;
            }
        }
        return null;
    };

    my.getCode = function(text, array){
        for (var i = 0; i < array.length; i++){
            if (array[i].text === text) {
                return array[i].value;
            }
        }
        return null;
    };

    my.codedString = function(op) {

        var ret = this.transactionLog.BANG + ',';
        ret += this.transactionLog.ROW + ',';
        ret += this.transactionLog.MESSAGE + ',';
        ret += op.zone + ',';
        ret += this.transactionLog.HEMISPHERE + ',';
        ret += op.xact + ',';
        ret += op.yact + ',';
        ret += this.rpad(Controller.gadget.position().accuracy() + '.', 5, '0') + ',';
        ret += DateFormatter.getOperationFormatDate(op.txn_date) + ',';
        ret += DateFormatter.getOperationFormatTime(op.txn_date) + ',';
        ret += this.transactionLog.PLACEHOLDER + ',';
        ret += this.transactionLog.ZERO + ',';
        ret += this.padQuad(op.quad) + this.padSite(op.site_id);

        if (op.visit) {
            ret += this.getCode(op.visit, this.visits);
            ret += this.getCode(op.condition, this.conditions);
            if ((op.condition === 'GOOD' || op.condition === 'DAMAGED') && !(op.fail_reason)) {
                ret += this.padCatch(op.moth_count);
            }
            if (op.fail_reason) {
                if ((op.condition === 'MISSING') || (op.condition === 'INACCESSIBLE')) {
                    ret += ' ';
                } else {
                    ret += this.transactionLog.ZERO;
                }
                if (op.fail_reason !== 'Passed') {
                    ret += "F" + this.getCode(op.fail_reason, this.failReasons);
                } else {
                    ret += "P";
                }
            }
        } else if (op.omit_reason) {
            ret += 'O' + this.getCode(op.omit_reason, this.omitReasons);
        } else {
            ret += op.traptype === 'Delta' ? 'D' : 'M';
            ret += Controller.gadget.relativePosition().distanceOutside > 0 ? 'B' : '';
        }
        ret += ',' + this.transactionLog.DOLLAR;
        ret += '\r\n';
        return ret;
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
