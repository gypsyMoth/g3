/**
 * Created by Ian on 1/15/14.
 */
var app = app || {};

(function () {
    'use strict';

    app.CurrentPosition = Backbone.Model.extend({
       defaults: {
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
           message: ''
       }
    });
})();