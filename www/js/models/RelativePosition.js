define(['underscore', 'backbone'], function(_, Backbone) { 'use strict';

    var RelativePosition = Backbone.Model.extend({
        defaults: {
            quad: '',
            site_id: '',
            distance: Number.MAX_VALUE,
            bearing: null,
            distanceOutside: -1,
            found: false
        }

//        initialize: function() {
//            this.on('change', this.onChange);
//        },
//
//        onChange: function() {
//          this.trigger('bubble');
//        }
    });

    return RelativePosition;
});
