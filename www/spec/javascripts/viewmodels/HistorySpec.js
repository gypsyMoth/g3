define(["jquery",
        "knockout",
        "src/viewmodels/History"
], function($, ko, HistoryView) {

    $(describe("History View", function() {

        var view, transactions;

        beforeEach(function() {
            view = new HistoryView();

            transactions = [];
            transactions.push({site_id: 2, date: 'Jun-30-2014', time:'13:00:00'});
            transactions.push({site_id: 1,date: 'Jun-30-2014', time:'12:00:00'});
            transactions.push({site_id: 4,date: 'Jul-01-2014', time:'13:00:00'});
            transactions.push({site_id: 5,date: 'Jul-01-2014', time:'13:30:00'});
            transactions.push({site_id: 3,date: 'Jul-01-2014', time:'12:00:00'});
            transactions.push({site_id: 6, date: 'Jul-02-2014', time:'13:00:00'});

            view.transactions(transactions);
            view.sortByDate(view.transactions);

        });

        it("Sorts an array of dates and times in reverse chronological order", function(){
            expect(view.transactions()[0].site_id).toEqual(6);
            expect(view.transactions()[1].site_id).toEqual(5);
            expect(view.transactions()[2].site_id).toEqual(4);
            expect(view.transactions()[3].site_id).toEqual(3);
            expect(view.transactions()[4].site_id).toEqual(2);
            expect(view.transactions()[5].site_id).toEqual(1);
        });

        it("Calculates the correct number of pages and updates page counter", function(){
            expect(view.pageCounter()).toEqual("Page 1 of 2")
        });

        it("Sets the first page with the last (chronologically) five transactions", function(){
            view.currentPage(view.transactions().slice(0,5));
            expect(view.currentPage().length).toEqual(5);
            expect(view.currentPage()[0].site_id).toEqual(6);
            expect(view.currentPage()[1].site_id).toEqual(5);
            expect(view.currentPage()[2].site_id).toEqual(4);
            expect(view.currentPage()[3].site_id).toEqual(3);
            expect(view.currentPage()[4].site_id).toEqual(2);
        });

        it("Sets the first page with sorted transactions when there are less than five", function(){
            view.transactions.pop();
            view.transactions.pop();
            view.currentPage(view.transactions().slice(0,5));
            expect(view.currentPage().length).toEqual(4);
            expect(view.currentPage()[0].site_id).toEqual(6);
            expect(view.currentPage()[1].site_id).toEqual(5);
            expect(view.currentPage()[2].site_id).toEqual(4);
            expect(view.currentPage()[3].site_id).toEqual(3);
        });

        it("Returns the first (chronologically) transaction on a second page", function(){
            view.changePage(1);
            expect(view.page()).toEqual(2);
            expect(view.currentPage().length).toEqual(1);
            expect(view.currentPage()[0].site_id).toEqual(1);
        });

        it("Sets next based on whether there is another page", function(){
            view.page(1);
            expect(view.next()).toEqual(true);
            view.page(2);
            expect(view.next()).toEqual(false);
        });

        it("Sets previous based on whether there is a previous page", function(){
            view.page(2);
            expect(view.previous()).toEqual(true);
            view.page(1);
            expect(view.previous()).toEqual(false);
        });



    }));
});

