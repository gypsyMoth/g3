define(['underscore', 'backbone', 'src/app'], function(_, Backbone, app) {
    'use strict';

    app.models.Filesystem = Backbone.Model.extend({
        defaults: {
            canDownload: false,
            fileCount: ''
        },

        initialize: function(options) {

        }

    });
});