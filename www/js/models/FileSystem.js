/**
 * Created by Ian on 1/23/14.
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
            message: 'Test message'
        }
    });
})();