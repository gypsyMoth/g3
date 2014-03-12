define(['underscore', 'backbone'], function(_, Backbone) { 'use strict';

    var RelativePosition = Backbone.Model.extend({
        defaults: {
            distance: Number.MAX_VALUE,
            bearing: null,
            distanceOutside: -1,
            found: false
        }
    });

    return RelativePosition;
});
