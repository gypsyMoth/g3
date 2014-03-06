define(['underscore', 'backbone'], function(_, Backbone) { 'use strict';

    var TransactionModel = Backbone.Model.extend({
        defaults: {
            transactions: 6
        }
    });
    return TransactionModel;
});