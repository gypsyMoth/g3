define (function () {

    var my = {};

    my.getSitesFormatDate = function() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear().toString();
        return yyyy + '-' + mm + '-' + dd + 'T00:00:00-00:00';
    };

    my.getScreenFormatDate = function(dateString) {
        //"2013-02-06T00:00:00-00:00"
        var parts = [];
        parts = dateString.split('-');
        return parts[1] + '/' + parts[2].substring(0,2) + '/' + parts[0].substring(2,4);
    };

    my.getOperationFormatDate = function() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var mon = this.getMonthString(mm);
        var yyyy = today.getFullYear().toString();
        return mon + '-' + dd + '-' + yyyy;
    };

    my.getMonthString = function(month) {
        switch (month) {
            case 1:
                return 'Jan';
            case 2:
                return 'Feb';
            case 3:
                return 'Mar';
            case 4:
                return 'Apr';
            case 5:
                return 'May';
            case 6:
                return 'Jun';
            case 7:
                return 'Jul';
            case 8:
                return 'Aug';
            case 9:
                return 'Sep';
            case 10:
                return 'Oct';
            case 11:
                return 'Nov';
            case 12:
                return 'Dec';
        }
    };

    return my;
}());
