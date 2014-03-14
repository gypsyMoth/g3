define(["src/models/Transaction"], function(Transaction) {

    describe("Transaction Model", function() {
        var trans;

        beforeEach( function() {
            trans = new Transaction();
        });

        it ("Can be created", function(){
           expect(trans).toBeDefined();
        });

    });
});