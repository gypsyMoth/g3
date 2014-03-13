define(["jquery",
    "underscore",
    "src/views/ManualLock"],
    function($, _, ManualLockView) { 'use strict';
        $(describe("Load Sites View", function() {
            var view;

            beforeEach(function() {
                loadFixtures('loadSites.html');
                $('body').append();
                view = new ManualLockView({collection: new SitesFileCollection(), template: _.template($('#loadSites-template').html())});
            });

            it("Can be instantiated", function() {
                expect(view).toBeDefined();
            });

            it("Has a collection", function() {
                expect(view.collection).toBeDefined();
            });
        }));
    });
