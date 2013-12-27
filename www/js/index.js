/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
        app.startGeolocation();
    },

    startGeolocation: function() {
        var watchId = navigator.geolocation.watchPosition(function (position) {
            var element = document.getElementById('locationSpan');
            var p = CoordinateConverter.datumShift({ Lon:position.coords.longitude, Lat:position.coords.latitude});
            var utm = CoordinateConverter.project(p);
            element.innerHTML = utm.Easting + 'E, ' + utm.Northing + 'N (' + utm.Zone + ')';
        },
        function (error) {
            var element = document.getElementById('locationSpan');
            element.innerHTML ='code: ' + error.code + '\n' + 'message: ' + error.message + '\n';
        },
        {enableHighAccuracy:true, timeout:1000, maximumAge:0 });
    }
};