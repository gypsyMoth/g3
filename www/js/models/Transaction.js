define(['underscore', 'backbone'], function(_, Backbone) { 'use strict';

    var TransactionModel = Backbone.Model.extend({
        defaults: {
            date: '',
            easting:'',
            northing:'',
            codedString:''
        },

        initialize: function(options) {

        }
    });
    return TransactionModel;
});