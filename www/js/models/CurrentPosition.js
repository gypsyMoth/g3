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
               DistanceOutside: false,
               Site: { quad: '', site_id: ''}
           },
           message: ''
       }
    });
})();