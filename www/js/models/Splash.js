define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';

    var SplashModel = Backbone.Model.extend({
        defaults: {
            message: 'Acquiring Satellites',
            gotSignal: false
        }

//        initialize: function() {
//            this.message = '';
//            this.gotSignal = false;
//            var that = this;
//            //setInterval(that.showSearching(that), 250);
//
//            that.set('message', 'Initializing filesystem...');
//                DB.initialize().then( function() {
//                    that.set('message', 'Loading sites from file...');
//
//                    App.SitesList = DB.loadSites('TX', 1).then( function() {
//                        that.set('message', 'Acquiring Satellites');
//                        App.startGeolocation();
//                    });
//                });
//        }

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