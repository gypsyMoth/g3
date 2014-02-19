/**
 * Created by Ian on 1/28/14.
 */

app.encoder = (function () {
    var my = {};

    my.constants = {
        "BANG": "#",
        "ROW": "000",
        "MESSAGE": "01234567890123",
        "HEMISPHERE": "North",
        "PLACEHOLDER": "",
        "ZERO": "0",
        "DOLLAR": "$"
    };

    my.getString = function(currentPosition) {
        var ret = my.constants.BANG;
        ret += my.constants.ROW;
        ret += my.constants.MESSAGE;
        ret += my.constants.HEMISPHERE;

    };

    return my;

})();
