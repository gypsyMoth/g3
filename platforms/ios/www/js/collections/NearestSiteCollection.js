define(['underscore',
    'backbone',
    'src/models/NearestSite'],
    function(_, Backbone, NearestSite) { 'use strict';

        var NearestSiteCollection = Backbone.Collection.extend({
            model: NearestSite
        });

        return NearestSiteCollection;
    });
