define(['underscore', 'backbone', 'src/models/Site', 'src/models/RelativePosition'], function(_, Backbone, Site, RelativePosition) { 'use strict';

    var NearestSite = Backbone.Model.extend({
        defaults: function() {
            return {
                site: new Site(),
                relativePosition: new RelativePosition()
            };
        }
    });

    return NearestSite;
});