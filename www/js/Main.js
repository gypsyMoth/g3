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
        "knockout-amd-helpers": 'lib/knockout-amd-helpers.min'
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

require(['src/App', 'knockout', 'knockout-amd-helpers', 'text'], function (App, ko) { 'use strict';
    document.ontouchmove = function(e){
        e.preventDefault();
    };

   document.ontouchend = function(e){
        var classStr = e.target.className;
        if (classStr.indexOf("ok") >= 0){
            e.preventDefault();
            if (e.target.disabled === false) {
                //console.log(classStr);
                $(e.target).trigger("click");
            }
            e.target.disabled = true;
        }
    }

    ko.amdTemplateEngine.defaultSuffix = ".html";
    ko.amdTemplateEngine.defaultPath = "src/templates";
    App.initialize();
});
