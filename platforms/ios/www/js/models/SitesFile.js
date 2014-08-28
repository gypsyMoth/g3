define(['underscore', 'backbone'], function(_, Backbone) { 'use strict';

    var SitesFile = Backbone.Model.extend({
        defaults: {
            fileEntry: null
        },

        initialize: function(options) {

        }
    });

    return SitesFile;
});
