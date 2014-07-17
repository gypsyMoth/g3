(function() { 'use strict';

    require.config({
        //urlArgs: 'cb=' + Math.random(),
        //baseUrl: "../www/",
        paths: {
            'src': '../../js',
            'jquery': '../../js/lib/jquery-2.0.3.min',
            'underscore': '../../js/lib/underscore-min',
            'backbone': '../../js/lib/backbone-min',
            'text': '../../js/lib/text',
            'moment': '../../js/lib/moment.min',
            'jasmine': 'lib/jasmine-2.0.0/jasmine',
            'jasmine-html': 'lib/jasmine-2.0.0/jasmine-html',
            'jasmine-jquery': 'lib/jasmine-jquery/jasmine-jquery',
            'boot': 'lib/jasmine-2.0.0/boot',
            'knockout': '../../js/lib/knockout-3.1.0',
            'knockout-amd-helpers': '../../js/lib/knockout-amd-helpers.min'
        },
        shim: {
            'underscore': {
                exports: "_"
            },
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            'backbone-nested': {
                deps: ['backbone'],
                exports: 'backbone-nested'
            },
            'jasmine': {
                exports: 'jasmine'
            },
            'jasmine-html': {
                deps: ['jasmine'],
                exports: 'jasmine'
            },
            'jasmine-jquery': {
                deps: ['jasmine', 'jasmine-html', 'jquery'],
                exports: 'jasmine'
            },
            'boot': {
                deps: ['jasmine', 'jasmine-html'],
                exports: 'jasmine'
            }
        }
    });

    var specs = [
        'util/CoordinateConverterSpec',
        'util/DateSpec',
        'util/DBSpec',
        'util/EncoderSpec',
        'util/GeolocationSpec',
        'util/NearestNeighborSpec',
        'util/DecoderSpec',
        'models/CurrentPositionSpec',
        'models/TransactionSpec',
        'models/RelativePositionSpec',
        'models/SitesFileSpec',
        'views/CautionSpec',
        'views/ConfirmSpec',
        'views/ExtrasSpec',
        'views/HomeSpec',
        'views/PlacementSpec',
        'views/SplashSpec',
        'views/LoadSitesSpec',
        'views/ManualLockSpec',
        'views/RandomSpec',
        'views/OmitSpec',
        'views/HistorySpec',
        'views/InspectionSpec',
        'viewmodels/HomeSpec'
    ];

    require(['src/app', 'boot', 'jasmine-jquery'], function (App) {

        // Load the specs
        require(specs, function () {

            // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
            window.onload();

            App.initialize();
        });
    });

})();

