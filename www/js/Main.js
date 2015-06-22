require.config({
    baseUrl: "js",
    paths: {
        "src": '.',
        "jquery": 'lib/jquery-2.0.3.min',
        "underscore": 'lib/underscore-min',
        "backbone": 'lib/backbone-min',
        "moment": 'lib/moment.min',
        "text": 'lib/text',
        "knockout": 'lib/knockout-3.1.0',
        "knockout-amd-helpers": 'lib/knockout-amd-helpers.min',
        "fastclick" : 'lib/fastclick'
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

require(['src/App', 'knockout', 'fastclick', 'knockout-amd-helpers', 'text'], function (App, ko, FastClick) { 'use strict';
    document.ontouchmove = function(e){
        e.preventDefault();
    };

    FastClick.attach(document.body);

    ko.amdTemplateEngine.defaultSuffix = ".html";
    ko.amdTemplateEngine.defaultPath = "src/templates";
    App.initialize();
});
