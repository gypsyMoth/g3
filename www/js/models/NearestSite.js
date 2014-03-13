define(['underscore', 'backbone'], function(_, Backbone) { 'use strict';

    var NearestSite = Backbone.Model.extend({
        defaults: {
            site: {
                quad: null,
                site: null
            },
            relativePosition: null
        },

        initialize: function(options) {

        }
    });

    return NearestSite;
});