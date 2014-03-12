define (['jquery', 'underscore', 'backbone','src/models/Transaction'], function ($, _, Backbone, Transaction) {
    'use strict';
    var TransactionCollection = Backbone.Collection.extend({
        model: Transaction,

        initialize: function(){
            this.addTransLog();
        },

        addTransLog: function(){
            var t1 = new Transaction({date:'3/6/14', trap:'Delta'});
            var t2 = new Transaction({date:'3/4/14', trap:'Milk Carton'});
            var t3 = new Transaction({date:'3/5/14', trap:'Delta'});
            var t4 = new Transaction({date:'3/3/14', trap:'Milk Carton'});
            var t5 = new Transaction({date:'3/6/14', trap:'Delta'});
            var t6 = new Transaction({date:'3/6/14', trap:'Delta'});
            this.add([t1,t2,t3,t4,t5,t6]);
        }
    });

    return TransactionCollection;
});
