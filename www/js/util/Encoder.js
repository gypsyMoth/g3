define (function () {
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

    my.rpad = function (string, width, padding) {
        return (width <= string.length) ? string : this.rpad(string + padding, width, padding)
    },

    my.lpad = function (string, width, padding) {
        return (width <= string.length) ? string : this.lpad(padding + string, width, padding)
    }

    return my;

});
