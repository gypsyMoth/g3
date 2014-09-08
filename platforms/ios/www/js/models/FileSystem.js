define(['underscore', 'backbone'], function(_, Backbone) { 'use strict';

    var FilesystemModel = Backbone.Model.extend({
        defaults: {
            canDownload: false,
            fileCount: ''
        },

        initialize: function(options) {

        }
    });

    return FilesystemModel;
});