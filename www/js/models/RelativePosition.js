define(['underscore', 'backbone'], function(_, Backbone) { 'use strict';

    var RelativePosition = Backbone.Model.extend({
        defaults: {
            distance: Number.MAX_VALUE,
            bearing: null,
            distanceOutside: -1,
            found: false
        },

        initialize: function() {
            this.listenTo(this, 'change', this.onChange);
        },

        onChange: function() {
          this.trigger('bubble');
        }
    });

    return RelativePosition;
});
