define(["src/util/Date"], function(Date) {

    describe("DateFormatter Module", function() {
        it ("Formats the date correctly from sites to screen", function() {
            var formattedDate = Date.getScreenFormatDate("2013-02-06T00:00:00-00:00");
            expect(formattedDate).toEqual('02/06/13');
        });
    });
});