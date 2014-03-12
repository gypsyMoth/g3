define(["jquery",
    "underscore",
    "src/models/SitesFile",
    "src/views/LoadSites"],
    function($, _, SitesFile, LoadSitesView) { 'use strict';
    $(describe("Load Sites View", function() {
        var view;

        beforeEach(function() {
            loadFixtures('loadSites.html');
            $('body').append();
            view = new LoadSitesView({model: new SitesFile(), template: _.template($('#loadSites-template').html())});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a model", function() {
            expect(view.model).toBeDefined();
        });
    }));
});
