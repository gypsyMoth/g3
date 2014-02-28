define(['underscore', 'backbone'], function(_, Backbone) { 'use strict';

    var SplashModel = Backbone.Model.extend({
        defaults: {
            message: 'Slow the Spread of the Gypsy Moth'
            //gotSignal: false
        }

//        initialize: function() {
//            this.message = '';
//            this.gotSignal = false;
//            var that = this;
//            //setInterval(that.showSearching(that), 250);
//      },

//        showSearching: function(that) {
//            var dots = '...';
//            if (dots === '...') {
//                dots = '   ';
//            } else {
//                dots = that.pad(3, (dots + '.'), ' ');
//            }
//            that.set('message', 'Acquiring Satellites' + dots);
//        },
//

    });

    return SplashModel;
});