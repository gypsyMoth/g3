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
            var dots = '...';
            var that = this;
            setInterval(function() {
                    if (dots.length < 3) {
                        dots += '.';
                    } else {
                        dots = '';
                    }
                    that.set('message', 'Acquiring Satellites' + dots);
            }, 1000);
        }
    });
})();