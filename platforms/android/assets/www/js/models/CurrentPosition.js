/**
 * Created by Ian on 1/15/14.
*/

(function () {
    'use strict';

    app.models.CurrentPosition = Backbone.Model.extend({
       defaults: {
           currentLatLon: {
             Latitude: '',
             Longitude: ''
           },
           currentUtm: {
               Easting: '',
               Northing: '',
               Zone: ''
           },
           nearestSite: {
               Distance: '',
               Found: false,
               Site: { quad: '', site_id: ''}
           },
           outsideTarget: false,
           message: ''
       }
    });
})();