define(['underscore',
    'backbone',
    'src/util/Encoder',
    'src/util/Date',
    'src/models/NearestSite',
    'src/collections/NearestSiteCollection'
], function(_, Backbone, Encoder, DateFormatter, NearestSite, NearestSiteCollection) {'use strict';

    var CurrentPosition = Backbone.Model.extend({
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
           nearestSites: new NearestSiteCollection([new NearestSite()]),
           operation: {
               easting: '',
               northing: '',
               zone: '',
               date: '',
               traptype: ''
           },
           message: ''
       },

        initialize: function() {
           this.listenTo(this.get('nearestSites'), 'change', this.updateMessage);
        },

        updateMessage: function() {
            var site = this.get('nearestSites').first().get('site');
            var message;
            if (typeof site === 'undefined') {
                message = 'No sites loaded, or wrong UTM zone';
            } else if (typeof site.xact === 'undefined') {
                message = 'No trap at this site';
            } else if (typeof site.visit === 'undefined') {
                var traptype = site.trap_type;
                var date = DateFormatter.getScreenFormatDate(site.txn_date);
                message = traptype + ' trap placed here on ' + date;
            } else {
                message = 'Invalid site';
            }
            this.set('message', message);
        },

        saveSites: function() {
            var site = this.get('nearestSites').first().get('site');
            var op = this.get('operation');
            site.zone = op.zone;
            site.xact = op.easting;
            site.yact = op.northing;
            site.txn_date = op.date;
            site.trap_type = op.traptype;
        },

        codedString: function() {
            var op = this.get('operation');
            var site = this.get('nearestSites').first().get('site');
            var rel = this.get('nearestSites').first().get('relativePosition');

            var ret = Encoder.transactionLog.BANG + ',';
            ret += Encoder.transactionLog.ROW + ',';
            ret += Encoder.transactionLog.MESSAGE + ',';
            ret += op.zone + ',';
            ret += Encoder.transactionLog.HEMISPHERE + ',';
            ret += op.easting + ',';
            ret += op.northing + ',';
            ret += Encoder.rpad((op.accuracy + '.'), 5, '0') + ',';
            ret += DateFormatter.getOperationFormatDate(Date.now()) + ',';
            ret += '00:00:00' + ',';
            ret += Encoder.transactionLog.PLACEHOLDER + ',';
            ret += Encoder.transactionLog.ZERO + ',';
            ret += Encoder.rpad(site.quad, 5, ' ') + Encoder.lpad(site.site_id, 4, '0');
            ret += op.traptype === 'Delta' ? 'D' : 'M';
            ret += rel.get('distanceOutside') > 0 ? 'B' : '';
            ret += ',' + Encoder.transactionLog.DOLLAR;
            ret += '\r\n';
            return ret;
        }
    });

    return CurrentPosition;
});