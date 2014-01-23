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
            app.db.initialize().then(function() {
                that.set('message', 'Acquiring Satellites');
                app.startGeolocation();
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
//        pad: function (width, string, padding) {
//            return (width <= string.length) ? string : pad(width, string + padding, padding)
//        }
    })
})();