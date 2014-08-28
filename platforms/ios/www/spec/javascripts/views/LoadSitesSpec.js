define(["jquery",
    "underscore",
    "src/models/SitesFile",
    "src/collections/SitesFileCollection",
    "src/views/LoadSites"],
    function($, _, SitesFile, SitesFileCollection, LoadSitesView) { 'use strict';
    $(describe("Load Sites View", function() {
        var view;

        beforeEach(function() {
            view = new LoadSitesView({collection: new SitesFileCollection()});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a collection", function() {
            expect(view.collection).toBeDefined();
        });
    }));
});
