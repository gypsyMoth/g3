define(["jquery",
    "src/collections/Transactions",
    "src/views/History"
], function($, Transactions, HistoryView) {

    $(describe("History View", function() {

        var view;

        beforeEach(function() {
            loadFixtures('history.html');
            $('body').append();
            view = new HistoryView({collection: new Transactions(), template: _.template($('#history-template').html())});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a collection", function() {
            expect(view.collection).toBeDefined();
        });

        it("Returns paged array of history messages", function(){
           alert(view.pagination(5,3)[0]);
           expect(view.pagination(5,3)[0]).toBeDefined;
        });
    }));
});
