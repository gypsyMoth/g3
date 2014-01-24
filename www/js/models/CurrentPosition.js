/**
 * Created by Ian on 1/15/14.
*/

(function () {
    'use strict';

    app.models.CurrentPosition = Backbone.Model.extend({
       defaults: {
           currentLatLon: {
             Latitude: '',
             Longitude: '',
             Accuracy: ''
           },
           currentUtm: {
               Easting: '',
               Northing: '',
               Zone: ''
           },
           nearestSite: {
               Distance: '',
               Found: false,
               Bearing: 'X',
               DistanceOutside: 0,
               Site: { quad: '', site_id: ''}
           },
           message: ''
       },

        initialize: function() {
           this.listenTo(this, 'change:nearestSite', this.updateMessage);
        },

        updateMessage: function() {
            var nearestSite = this.get('nearestSite');
            var message;
            if (typeof nearestSite === 'undefined') {
                message = 'No sites loaded, or wrong UTM zone';
            } else if (typeof nearestSite.Site.xact === 'undefined') {
                message = 'No trap at this site';
            } else if (typeof nearestSite.Site.visit === 'undefined') {
                var traptype = nearestSite.Site.trap_type;
                var date = this.formatDate(nearestSite.Site.txn_date);
                message = traptype + ' trap placed here on ' + date;
            } else {
                message = 'Invalid site';
            }

            this.set('message', message);
        },

        formatDate: function(dateString) {
            //"2013-02-06T00:00:00-00:00"
            var parts = [];
            parts = dateString.split('-');
            return parts[1] + '/' + parts[2].substring(0,2) + '/' + parts[0].substring(2,4);
        }
    });
})();