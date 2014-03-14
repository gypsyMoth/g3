define (['jquery', 'underscore', 'backbone','src/models/Transaction'], function ($, _, Backbone, Transaction) {
    'use strict';
    var TransactionCollection = Backbone.Collection.extend({
        model: Transaction,

        initialize: function(){
            this.loadTransLog();
        },

        loadTransLog: function(){
            var t1 = new Transaction({date:'Mar-06-2014', trap:'Delta'});
            var t2 = new Transaction({date:'Mar-04-2014', trap:'Milk Carton'});
            var t3 = new Transaction({date:'Mar-05-2014', trap:'Delta'});
            var t4 = new Transaction({date:'Mar-03-2014', trap:'Milk Carton'});
            var t5 = new Transaction({date:'Mar-06-2014', trap:'Delta'});
            var t6 = new Transaction({date:'Mar-10-2014', trap:'Delta'});
            var t7 = new Transaction({date:'Mar-04-2014', trap:'Delta'});
            var t8 = new Transaction({date:'Mar-01-2014', trap:'Delta'});
            var t9 = new Transaction({date:'Feb-26-2014', trap:'Delta'});
            var t10 = new Transaction({date:'Mar-14-2014', trap:'Delta'});
            var t11 = new Transaction({date:'Mar-06-2014', trap:'Delta'});
            this.add([t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11]);
        }
    });

    return TransactionCollection;
});
