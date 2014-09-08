define(['underscore',
    'backbone',
    'src/models/SitesFile'],
    function(_, Backbone, SitesFile) { 'use strict';

    var SitesFileCollection = Backbone.Collection.extend({
        model: SitesFile
    });

    return SitesFileCollection;
});
