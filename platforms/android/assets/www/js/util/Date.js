/**
 * Created by Ian on 1/24/14.
 */
app.DateFormatter = (function () {
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

    return my;
}());
