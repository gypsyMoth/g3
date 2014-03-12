define(['underscore', 'backbone'], function(_, Backbone) { 'use strict';

    var TransactionModel = Backbone.Model.extend({
        defaults: {
            date: '',
            trap: ''
        }
    });
    return TransactionModel;
});