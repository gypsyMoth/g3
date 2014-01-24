/**
 * Created by Ian on 1/17/14.
 */

describe("Tests for CurrentPosition", function() {
   it("Can be created", function() {
       var p = new app.models.CurrentPosition();
       expect(p).toBeDefined();
   });

    describe("Changes the message when the nearest site changes", function() {
        var position = new app.models.CurrentPosition();



        var expectMessageToMatchSite = function(site, expectedMessage) {
            var siteHeader = {
                Distance: '10',
                Found: false,
                Bearing: 'N',
                DistanceOutside: 0
            };
            siteHeader.Site = site;
            position.set({nearestSite: siteHeader});
            var message = position.get('message');
            expect(message).toEqual(expectedMessage);
        };

        it ("Formats the date correctly", function() {
            var formattedDate = position.formatDate("2013-02-06T00:00:00-00:00");
            expect(formattedDate).toEqual('02/06/13');
        });

        it ("Displays unaddressed message", function() {

            var unaddressed = {
                "zone":15,
                "xth":"329229",
                "yth":"3475979",
                "quad":"FIREP",
                "site_id":1,
                "grid":"30",
                "trap_type":"Milk Carton",
                "moth_count":0
            };
            expectMessageToMatchSite(unaddressed, 'No trap at this site');
        });

        it ("Displays placed delta message", function() {
            var delta = {
                "zone":17,
                "xth":"700028",
                "yth":"4141028",
                "xact":"700028",
                "yact":"4141028",
                "quad":"HOLID",
                "site_id":9009,
                "grid":"9999",
                "trap_type":"Delta",
                "moth_count":0,
                "txn_date":"2013-02-06T00:00:00-00:00"
            };
            expectMessageToMatchSite(delta, 'Delta trap placed here on 02/06/13');
        });

        it ("Displays placed milk carton message", function() {
            var milkCarton = {
                "zone":17,
                "xth":"700028",
                "yth":"4141028",
                "xact":"700028",
                "yact":"4141028",
                "quad":"HOLID",
                "site_id":9009,
                "grid":"9999",
                "trap_type":"Milk Carton",
                "moth_count":0,
                "txn_date":"2013-02-06T00:00:00-00:00"
            };
            expectMessageToMatchSite(milkCarton, 'Milk Carton trap placed here on 02/06/13');
        });
    });
});