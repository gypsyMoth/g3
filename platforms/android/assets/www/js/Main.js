require.config({
    baseUrl: "js",
    paths: {
        src: '.',
        jquery: 'lib/jquery-2.0.3.min',
        underscore: 'lib/underscore-min',
        backbone: 'lib/backbone-min'
    },
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require(['src/App'], function (App) { 'use strict';
    App.initialize();
});
