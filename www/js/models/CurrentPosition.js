
define(['underscore', 'backbone', 'src/app', 'src/util/Date'], function(_, Backbone, app, Date) {
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
               zone: '',
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
                var date = Date.getScreenFormatDate(site.txn_date);
                message = traptype + ' trap placed here on ' + date;
            } else {
                message = 'Invalid site';
            }
            this.set('message', message);
        },

        saveSites: function() {
            var site = this.get('site');
            var op = this.get('operation');
            site.zone = op.zone;
            site.xact = op.easting;
            site.yact = op.northing;
            site.txn_date = op.date;
            site.trap_type = op.traptype;
        },

        codedString: function() {
            var op = this.get('operation');
            var site = this.get('site');
            var rel = this.get('relativePosition');

            var ret = this.constants.BANG + ',';
            ret += this.constants.ROW + ',';
            ret += this.constants.MESSAGE + ',';
            ret += op.zone + ',';
            ret += this.constants.HEMISPHERE + ',';
            ret += op.easting + ',';
            ret += op.northing + ',';
            ret += app.rpad((op.accuracy + '.'), 5, '0') + ',';
            ret += app.DateFormatter.getOperationFormatDate() + ',';
            ret += '00:00:00' + ',';
            ret += this.constants.PLACEHOLDER + ',';
            ret += this.constants.ZERO + ',';
            ret += app.rpad(site.quad, 5, ' ') + app.lpad(site.site_id, 4, '0');
            ret += op.traptype === 'Delta' ? 'D' : 'M';
            ret += rel.DistanceOutside > 0 ? 'B' : '';
            ret += ',' + this.constants.DOLLAR;
            ret += '\r\n';
            return ret;
        },

        constants: {
            "BANG": "#",
            "ROW": "000",
            "MESSAGE": "01234567890123",
            "HEMISPHERE": "North",
            "PLACEHOLDER": "",
            "ZERO": "0",
            "DOLLAR": "$"
        }


    });
});