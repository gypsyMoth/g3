define(['src/util/Decoder', 'src/models/Transaction'], function(Decoder, Transaction) {
    describe("Decoder Module", function() {

        var t;

        it("Reads the quad from a transaction model", function() {
            t = new Transaction({codedString:'GLACE0001DB', date:'Mar-06-2014', easting:'551087', northing:'4119824'});
            expect(Decoder.quad(t.get("codedString"))).toEqual('GLACE');
        });

        it("Reads the site from a transaction model", function() {
            t = new Transaction({codedString:'GLACE0001DB', date:'Mar-06-2014', easting:'551087', northing:'4119824'});
            expect(Decoder.site(t.get("codedString"))).toEqual('0001');
        });

        it("Reads the placement outside target circle from a transaction model", function() {
            t = new Transaction({codedString:'GLACE0001DB', date:'Mar-06-2014', easting:'551087', northing:'4119824'});
            expect(Decoder.operation(t.get("codedString"))).toEqual('placement [outside target circle]');
        });

        it("Reads the history from a transaction model", function() {
            t = new Transaction({codedString:'GLACE0001D', date:'Mar-06-2014', easting:'551087', northing:'4119824'});
            alert(Decoder.historyString(t));
            expect(Decoder.historyString(t)).toEqual('Mar-06-2014 GLACE 0001 551087E, 4119824N\ndelta trap placement');
        });

        it("Reads mid-season QC inspection from a transaction model", function() {
            t = new Transaction({codedString:'GLACE0001MG0FA', date:'Mar-06-2014', easting:'551087', northing:'4119824'});
            alert(Decoder.operation(t.get("codedString")));
            expect(Decoder.operation(t.get("codedString"))).toEqual('mid-season QC inspection');
        });

        it("Reads final inspection from a transaction model", function() {
            t = new Transaction({codedString:'GLACE0001FG000', date:'Mar-06-2014', easting:'551087', northing:'4119824'});
            alert(Decoder.operation(t.get("codedString")));
            expect(Decoder.operation(t.get("codedString"))).toEqual('final inspection');
        });

    });
});
