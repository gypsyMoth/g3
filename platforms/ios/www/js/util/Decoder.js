define (function () { 'use strict';
    var my = {};

    my.quad = function(code){
        return code.substring(0,5);
    };

    my.site = function(code){
        return code.substring(5,9);
    };

    my.trapType = function(code) {
        if (code.substring(9,10) === 'D'){
            return "delta trap";
        }
        else if (code.substring(9,10) === 'M'){
            return "milk carton trap";
        } else {
            return "unknown";
        }

    };

    my.operation = function(code) {
        var op = "Invalid Transaction";
        if (code.length <= 10 && code.substring(9,10).match(/[MD]/)) {
            op = "placement";
        } else if (code.length <= 14) {
            if (code.substring(9,10) === 'O'){
                op = "omitted";
            } else if (code.substring(10,11) === 'B') {
                op = "placement [outside target circle]";
            } else {
                if (code.substring(9,10) === 'M') {
                    op = "mid-season inspection";
                } else if (code.substring(9,10) === 'F') {
                    op = "final inspection";
                }
                if (code.length > 12 && code.substring(12,13).match(/[^\d]/)) {
                    op = op.replace(" "," QC ");
                }
            }
        }
        return op;
    };

    my.omitReason = function(code) {
        var reason = code.substring(10,11);
        var r = "";
        switch(reason){
            case('H'):
                r = "No structure on which to hang trap";
                break;
            case('L'):
                r = "Landowner denied access";
                break;
            case('O'):
                r = "Obstacle prohibited access";
                break;
            case('W'):
                r = "Inaccessible terrain - too wet";
                break;
            case('R'):
                r = "Inaccessible terrain - too rough or steep";
                break;
            case('V'):
                r = "Inaccessible terrain - vegetation too thick";
                break;
            case('S'):
                r = "Safety hazard";
                break;
            default:
                break;
        }
        return r;
    };

    my.trapCondition = function(code){
        var condition = code.substring(10,11)
        var c = "";
        switch(condition){
            case('G'):
                c = "good";
                break;
            case('D'):
                c = "damaged";
                break;
            case('M'):
                c = "missing";
                break;
            case('I'):
                c = "inaccessible";
                break;
            default:
                break;
        }

        return c;
    };

    my.mothCount = function(code) {
        return code.substring(11,14);
    };

    my.passFail = function(code) {
        if (code.substring(12,13) === 'P') {
            return "passed"
        } else {
            return "failed"
        }
    };

    my.failReason = function(code) {
        var fail = code.substring(13,14);
        var f = "";
        switch(fail){
            case('A'):
                f = "the trap is not assembled correctly";
                break;
            case('C'):
                f = "trap placed outside target circle";
                break;
            case('D'):
                f = "directions to the site are incorrect or incomplete";
                break;
            case('G'):
                f = "grid set at wrong spacing";
                break;
            case('I'):
                f = "trap info not recorded correctly on trap";
                break;
            case('R'):
                f = "record filled out, no trap set (bogus data)";
                break;
            case('T'):
                f = "delta trap set where milk carton indicated";
                break;
            case('U'):
                f = "UTMs recorded incorrectly on data sheet";
                break;
            case('X'):
                f = "trapper did not remove trap from field";
                break;
            case('M'):
                f = "multiple traps set at one site";
                break;
            case('S'):
                f = "trap set too low to ground";
                break;
            case('W'):
                f = "inspection incorrectly done";
                break;
            default:
                break;
        }
        return f;
    };

    my.historyString = function(transaction){

        var code = transaction.get("codedString");
        var e = transaction.get("easting");
        var n = transaction.get("northing");
        var codeOp = this.operation(code);

        var decoded = transaction.get("date") + " ";

        if (e.match(/^\d+$/) && n.match(/^\d+$/) && codeOp != 'Invalid Transaction'){
            decoded += this.quad(code) + " ";
            decoded += this.site(code) + " ";
            decoded += transaction.get("easting") + "E, ";
            decoded += transaction.get("northing") + "N\n";
            var codeOp = this.operation(code);
            var t = "";
            switch(codeOp){
                case('placement'):
                case('placement [outside target circle]'):
                    t = this.trapType(code) + " " + codeOp;
                    break;
                case('omitted'):
                    t = codeOp + ": " + this.omitReason(code);
                    break;
                case('mid-season inspection'):
                case('final inspection'):
                    var cond = this.trapCondition(code);
                    t = codeOp + " of " + cond + " trap";
                    if ((cond != "missing") && (cond != "inaccessible")) {
                        t += " with " + this.mothCount(code) + " moths"
                    }
                    break;
                case('mid-season QC inspection'):
                case('final QC inspection'):
                    var grade = this.passFail(code);
                    t = grade + " " + codeOp + " of " + this.trapCondition(code) + " trap";
                    if (grade === 'failed') {
                        t += ": " + this.failReason(code);
                    }
                    break;
                default:
                    break;
            }
            decoded += t;
        } else {
            decoded += "***INVALID DATA*** Check trans_log.txt!"
        }
        return decoded;
    };

    return my;

});
