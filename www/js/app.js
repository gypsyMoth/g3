define(['jquery',
    'underscore',
    'backbone',
    'src/Router',
    'src/util/Geolocation',
    'src/util/DB',
    'src/models/Splash'
    ], function($, _, Backbone, Router, Geolocation, DB, Splash) {
    'use strict';

     return {
        SitesList: [],
        Here: {},
        isInitialized: false,

        operationTypes: {
            ERROR: 'ERROR',
            UNADDRESSED: 'UNADDRESSED',
            PLACED: 'PLACED',
            OMITTED: 'OMITTED',
            MIDSEASON: 'MIDSEASON',
            FINAL: 'FINAL'
        },

        initialize: function () {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        },

        onDeviceReady: function () {
            this.pageRouter = new Router();
            Backbone.history.start();

            if (this.isInitialized) {
                this.pageRouter.navigate('home', true);
            } else {
                this.showSplash();
                this.pageRouter.navigate('splash', true);
            }
        },

        showSplash: function () {
            this.Startup = new Splash();
            this.Startup.set('message', 'Initializing filesystem...');

            DB.initialize().then(function () {
                this.Startup.set('message', 'Loading sites from file...');
                this.SitesList = DB.loadSites('TX', 1).then(function () {
                    this.Startup.set('message', 'Acquiring Satellites');
                    Geolocation.start();
                });
            });
        },

        fail: function (error) {
            console.log('G3 error: ' + error.message);
        }
    };
});