define(['underscore', 'backbone', 'src/models/RelativePosition'], function(_, Backbone, RelativePosition) { 'use strict';

    var NearestSite = Backbone.Model.extend({
        defaults: {
            site: {
                quad: '',
                site: ''
            },
            relativePosition: new RelativePosition()
        },

        initialize: function(options) {

        }
    });

    return NearestSite;
});