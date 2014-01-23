/**
 * Created by Ian on 1/23/14.
 */
(function () {
    'use strict';

    app.models.Filesystem = Backbone.Model.extend({
        defaults: {
            canDownload: false,
            fileCount: ''
        },

        initialize: function(options) {

        }

    });
})();