/**
 * Created by Ian on 1/16/14.
 */
var app = app || {};

(function ($) {
    'use strict';

    app.AppView = Backbone.View.extend({

        el: 'body',

        //homeTemplate: _.template($('#home-template').html()),

        initialize: function() {
            app.Here = new app.CurrentPosition();
            app.Home = new app.HomeView({model: app.Here});
            this.bindEvents();
        },

        bindEvents: function() {
            document.addEventListener('deviceready', this.startGeolocation, false);
        },

//        onDeviceReady: function() {
//            startGeolocation();
//        },

        startGeolocation: function() {
            var watchId = navigator.geolocation.watchPosition(function (position) {
                    var p = CoordinateConverter.datumShift({ Lon:position.coords.longitude, Lat:position.coords.latitude});
                    var utm = CoordinateConverter.project(p);
                    //here = new app.CurrentPosition();
                    app.Here.set({currentUtm: utm});
                    app.Here.set({nearestSite: Sites.Nearest(utm, app.SitesList)});
                },
                this.fail,
                {enableHighAccuracy:true, timeout:1000, maximumAge:0 });
        },

        render: function () {

        },

        fail: function (error) {
            console.log(msg);
        }

    });
})(jQuery);