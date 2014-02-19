/**
 * Created by Ian on 1/20/14.
 */
(function () {
    'use strict';

    app.models.Splash = Backbone.Model.extend({
        defaults: {
            message: 'Acquiring Satellites',
            gotSignal: false
        },

        initialize: function() {
            this.message = '';
            this.gotSignal = false;
            var that = this;
            //setInterval(that.showSearching(that), 250);

            that.set('message', 'Initializing filesystem...');
                app.db.initialize().then( function() {
                    that.set('message', 'Loading sites from file...');

                    app.SitesList = app.db.loadSites('TX', 1).then( function() {
                        that.set('message', 'Acquiring Satellites');
                        app.startGeolocation();
                    });
                });
        }

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
})();