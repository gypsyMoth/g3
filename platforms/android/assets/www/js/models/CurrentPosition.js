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
           relativePosition: {
               Distance: '',
               Found: false,
               Bearing: 'X',
               DistanceOutside: 0
           },
           site: {
               quad: '',
               site_id: ''
           },
           operation: {
               easting: '',
               northing: '',
               date: '',
               traptype: ''
           },
           message: ''
       },

        initialize: function() {
           this.listenTo(this, 'change:relativePosition', this.updateMessage);
        },

        updateMessage: function() {
            var site = this.get('site');
            var message;
            if (typeof site === 'undefined') {
                message = 'No sites loaded, or wrong UTM zone';
            } else if (typeof site.xact === 'undefined') {
                message = 'No trap at this site';
            } else if (typeof site.visit === 'undefined') {
                var traptype = site.trap_type;
                var date = app.DateFormatter.getScreenFormatDate(site.txn_date);
                message = traptype + ' trap placed here on ' + date;
            } else {
                message = 'Invalid site';
            }
            this.set('message', message);
        },

        saveSites: function() {
            var site = this.get('site');
            var op = this.get('operation');
            site.xact = op.easting;
            site.yact = op.northing;
        }
    });
})();