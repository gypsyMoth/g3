define (['jquery', 'underscore', 'backbone','src/models/Transaction'], function ($, _, Backbone, Transaction) {
    'use strict';
    var TransactionCollection = Backbone.Collection.extend({
        model: Transaction,

        initialize: function(){

        }

//        testTransLog: function(){
//            var t1 = new Transaction({date:'Mar-06-2014', easting:'551087', northing:'4119824', codedString:'GLACE0001D'});
//            var t2 = new Transaction({date:'Mar-05-2014', easting:'551087', northing:'4119824', codedString:'GLACE0002OL'});
//            var t3 = new Transaction({date:'Mar-03-2014', easting:'551087', northing:'4119824', codedString:'ODD  0002D'});
//            var t4 = new Transaction({date:'Mar-09-2014', easting:'551087', northing:'4119824', codedString:'GLACE0001MG0'});
//            var t5 = new Transaction({date:'Mar-25-2014', easting:'551087', northing:'4119824', codedString:'GLACE0001MG0FA'});
//            var t6 = new Transaction({date:'Feb-26-2014', easting:'551087', northing:'4119824', codedString:'ODD  0002MG0P'});
//            var t7 = new Transaction({date:'Jan-26-2014', easting:'551087', northing:'4119824', codedString:'GLACE0001M'});
//            var t8 = new Transaction({date:'Mar-07-2014', easting:'551087', northing:'4119824', codedString:'GLACE0001DB'});
//            var t9 = new Transaction({date:'Mar-06-2014', easting:'551087', northing:'4119824', codedString:'GLACE0001FI'});
//            var t10 = new Transaction({date:'Mar-08-2014', easting:'551087', northing:'4119824', codedString:'GLACE0001FD0FR'});
//            var t11 = new Transaction({date:'Mar-26-2014'});
//            this.add([t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11]);
//        }
    });

    return TransactionCollection;
});
