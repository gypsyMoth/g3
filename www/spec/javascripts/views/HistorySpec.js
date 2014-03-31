define(["jquery",
    "src/collections/Transactions",
    "src/views/History"
], function($, Transactions, HistoryView) {

    $(describe("History View", function() {

        var view;

        beforeEach(function() {
            view = new HistoryView({collection: new Transactions()});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a collection", function() {
            expect(view.collection).toBeDefined();
        });
    }));
});
