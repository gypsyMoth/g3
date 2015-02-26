define(['jquery',
    'knockout',
    'src/util/Decoder'
], function($,
            ko,
            Decoder
    ) {

    'use strict';

    var HistoryView = function() {

        this.transactions = ko.observableArray();

        this.currentPage = ko.observableArray();

        this.initialize = function(data){
            this.sortByDate(data);
            for (var i = 0; i < data.length; i++){
                this.transactions.push({message: Decoder.historyString(data[i])});
            }
            if (this.pages() < 2){
                this.currentPage(this.transactions());
            } else {
                this.currentPage(this.transactions().slice(0,5));
            }
        };

        this.decode = function(transaction){
            return Decoder.historyString(transaction)
        };

        this.changePage = function(step){
            var numberPerPage = 5;
            var next = this.page() + step;
            var top = (next * numberPerPage);
            this.currentPage(this.transactions().slice(top - numberPerPage, top));
            this.page(next);
        };

        this.sortByDate = function(array){
            array.sort(function(t1, t2){
                var date1 = Date.parse(t1.date + " " + t1.time);
                var date2 = Date.parse(t2.date + " " + t2.time);
                if (date1 > date2) {return -1;}
                if (date1 < date2) {return 1;}
                return 0;
            });
        };

        this.pages = ko.computed(function(){
            return Math.ceil(this.transactions().length / 5);
        }, this);

        this.page = ko.observable(1);

        this.previous = ko.computed(function(){
            return this.page() - 1 > 0;
        }, this);

        this.next = ko.computed(function(){
            return this.page() + 1 <= this.pages();
        }, this);

        this.pageCounter = ko.computed(function(){
            return "Page " + this.page() + " of " + this.pages();
        }, this);


    };

    return HistoryView;

});
