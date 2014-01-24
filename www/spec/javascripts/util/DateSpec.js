/**
 * Created by Ian on 1/24/14.
 */

describe("DateFormatter Module", function() {
    it ("Formats the date correctly from sites to screen", function() {
        var formattedDate = app.DateFormatter.getScreenFormatDate("2013-02-06T00:00:00-00:00");
        expect(formattedDate).toEqual('02/06/13');
    });
})