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

//                    app.SitesList = [
//                        {"zone":15,"xth":"329229","yth":"3475979","quad":"FIREP","site_id":1,"grid":"30","trap_type":"Milk Carton","moth_count":0},
//                        {"zone":15,"xth":"329180","yth":"3475941","quad":"DITCH","site_id":2,"grid":"30","trap_type":"Milk Carton","moth_count":0},
//                        {"zone":15,"xth":"528000","yth":"4176000","quad":"TEST","site_id":3,"grid":"8000","trap_type":"Milk Carton","moth_count":0}
//                    ];
//                    that.set('message', 'Acquiring Satellites');
//                    app.startGeolocation();

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