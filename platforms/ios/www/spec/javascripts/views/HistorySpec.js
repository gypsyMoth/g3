define(["jquery",
    "src/models/Transaction",
    "src/collections/Transactions",
    "src/views/History"
], function($, Transaction, Transactions, HistoryView) {

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

        it("Sorts a collection of dates and times in reverse chronological order", function(){
            var collection = new Transactions();
            collection.push(new Transaction({date: 'Jun-30-2014', time:'13:00:00'}));
            collection.push(new Transaction({date: 'Jun-30-2014', time:'12:00:00'}));
            collection.push(new Transaction({date: 'Jul-01-2014', time:'13:00:00'}));
            collection.push(new Transaction({date: 'Jul-01-2014', time:'13:30:00'}));
            collection.push(new Transaction({date: 'Jul-01-2014', time:'12:00:00'}));

            view.collection = collection;
            view.sortDate(view.collection);

            expect(view.collection.at(0).get('date') + " " + view.collection.at(0).get('time')).toEqual('Jul-01-2014 13:30:00');
            expect(view.collection.at(1).get('date') + " " + view.collection.at(1).get('time')).toEqual('Jul-01-2014 13:00:00');
            expect(view.collection.at(2).get('date') + " " + view.collection.at(2).get('time')).toEqual('Jul-01-2014 12:00:00');
            expect(view.collection.at(3).get('date') + " " + view.collection.at(3).get('time')).toEqual('Jun-30-2014 13:00:00');
            expect(view.collection.at(4).get('date') + " " + view.collection.at(4).get('time')).toEqual('Jun-30-2014 12:00:00');

        })
    }));
});
