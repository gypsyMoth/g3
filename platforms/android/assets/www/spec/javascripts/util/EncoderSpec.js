define(['src/util/Encoder'], function(encoder) {
    describe("Encoder Module", function() {
       it("Has a method that returns an encoded string", function() {
          expect(encoder.getString).toBeDefined();
       });
    });
});