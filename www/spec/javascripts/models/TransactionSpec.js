define(["src/models/Transaction"], function(Transaction) {

    describe("Transaction Model", function() {
        var trans;

        beforeEach( function() {
            trans = new Transaction();
        });

        it ("Can be created", function(){
           expect(trans).toBeDefined();
        });

        it ("Has a date, coordinate, and code properties", function(){
            expect(trans.get("date")).toBeDefined();
            expect(trans.get("easting")).toBeDefined();
            expect(trans.get("northing")).toBeDefined();
            expect(trans.get("codedString")).toBeDefined();

        });
    });
});