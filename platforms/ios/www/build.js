({
    baseUrl: "js",
    paths: {
        src: '.',
        jquery: 'lib/jquery-2.0.3.min',
        underscore: 'lib/underscore-min',
        backbone: 'lib/backbone-min',
        requireLib: 'lib/require'
    },
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    },
    include: 'requireLib',
    name: 'Main',
    out: 'main.min.js',
    optimize: 'none'
})
