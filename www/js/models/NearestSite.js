define(['underscore', 'backbone', 'src/models/RelativePosition'], function(_, Backbone, RelativePosition) { 'use strict';

    var NearestSite = Backbone.Model.extend({
        defaults: function() {
            return {
                site: {quad: '', site_id: ''},
                relativePosition: new RelativePosition()
            };
        },

        initialize: function(options) {
            this.listenTo(this.get('relativePosition'), 'bubble', this.update);
        },

        update: function() {
          this.trigger('bubble');
        }
    });

    return NearestSite;
});