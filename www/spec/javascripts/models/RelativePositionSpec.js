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

//        it("Raises the relativePosition:change event when it's properties change", function() {
//            var model = new RelativePosition();
//            spyOn(model, 'onChange');
//            model.set('distance', 9000);
//            expect(model.onChange).toHaveBeenCalled();
//        });

    });
});
