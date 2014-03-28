define(["jquery",
    "underscore",
    "src/models/CurrentPosition",
    "src/views/Omit",
    "text!src/templates/omit.html"],
    function($, _, CurrentPosition, OmitView, OmitTemplate) { 'use strict';
    $(describe("Omit View", function() {
        var view;

        beforeEach(function() {
            loadFixtures('omit.html');
            $('body').append();
            view = new OmitView({model: new CurrentPosition(), template: _.template($(OmitTemplate).html())});
        });

        it("Can be instantiated", function() {
            expect(view).toBeDefined();
        });

        it("Has a model", function() {
            expect(view.model).toBeDefined();
        });
    }));
});
