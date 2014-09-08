define(['src/util/Decoder'], function(Decoder) {
    describe("Decoder Module", function() {

        describe("Translates operations correctly from a string", function() {

            var text;

            it("Placement", function() {
                text = 'GLACE0001D';
                expect(Decoder.operation(text)).toEqual('placement');
            });

            it("Placement outside", function() {
                text = 'GLACE0001MB';
                expect(Decoder.operation(text)).toEqual('placement [outside target circle]');
            });

            it("Omit", function() {
                text = 'GLACE0001OS';
                expect(Decoder.operation(text)).toEqual('omitted');
            });

            it("Mid-season Inspection", function() {
                text = 'GLACE0001MG000';
                expect(Decoder.operation(text)).toEqual('mid-season inspection');
            });

            it("Final Inspection", function() {
                text = 'GLACE0001FI';
                expect(Decoder.operation(text)).toEqual('final inspection');
            });

            it("Mid-season QC Inspection", function() {
                text = 'GLACE0001MD0FA';
                expect(Decoder.operation(text)).toEqual('mid-season QC inspection');
            });

            it("Final QC Inspection", function() {
                text = 'GLACE0001FG0P';
                expect(Decoder.operation(text)).toEqual('final QC inspection');
            });

            it("Returns an error for bad code string", function(){
                text = 'GLAC001B';
                expect(Decoder.operation(text)).toEqual('Invalid Transaction');
            });
        });

        describe("Reads history transactions", function(){

            var t;

            it("Reads a placement from a transaction model", function() {
                t = {codedString:'GLACE0001D', date:'Mar-06-2014', easting:'551087', northing:'4119824'};
                expect(Decoder.historyString(t)).toEqual('Mar-06-2014 GLACE 0001 551087E, 4119824N\ndelta trap placement');
            });

            it("Reads an inspection from a transaction model", function() {
                t = {codedString:'GLACE0001MG001', date:'Mar-06-2014', easting:'551087', northing:'4119824'};
                expect(Decoder.historyString(t)).toEqual('Mar-06-2014 GLACE 0001 551087E, 4119824N\nmid-season inspection of good trap with 001 moths');
            });

            it("Reads a QC inspection from a transaction model", function() {
                t = {codedString:'GLACE0001FD0FA', date:'Mar-06-2014', easting:'551087', northing:'4119824'};
                expect(Decoder.historyString(t)).toEqual('Mar-06-2014 GLACE 0001 551087E, 4119824N\nfailed final QC inspection of damaged trap: the trap is not assembled correctly');
            });

            it("Returns an error for bad coordinate", function(){
                t = {codedString:'GLACE0001FD0FA', date:'Mar-06-2014', easting:'551087E', northing:'4119824'};
                expect(Decoder.historyString(t)).toEqual('Mar-06-2014 ***INVALID DATA*** Check trans_log.txt!');
            });

        });
    });
});
