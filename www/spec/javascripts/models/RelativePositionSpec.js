define(["src/models/RelativePosition"], function(RelativePosition) { 'use strict';

    describe("RelativePosition Model", function() {
        it("Can be initialized", function() {
            var model = new RelativePosition();
            expect(model).toBeDefined();
        });

        it("Has it's properties defined on initialization", function() {
            var model = new RelativePosition();
            expect(model.get('distance')).toBeDefined();
            expect(model.get('bearing')).toBeDefined();
            expect(model.get('distanceOutside')).toBeDefined();
            expect(model.get('found')).toBeDefined();
        });

        xit("Raises the bubble event when it's properties change", function() {
            //spyOn doesn't seem to work with Backbone events...
            var model = new RelativePosition();
            spyOn(model, 'onChange');
            model.set('distance', 9000);
            expect(model.onChange).toHaveBeenCalled();
        });
    });
});
