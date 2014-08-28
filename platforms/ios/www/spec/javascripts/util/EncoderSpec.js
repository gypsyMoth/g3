define(['src/util/Encoder'],
    function(encoder) { 'use strict';
    describe("Encoder Module", function() {
       it("Has a method that returns an encoded string", function() {
          expect(encoder.getString).toBeDefined();
       });

       it("Pads site ids correctly", function() {
           expect(encoder.padSite(9)).toEqual('0009');
           expect(encoder.padSite(90)).toEqual('0090');
           expect(encoder.padSite(900)).toEqual('0900');
           expect(encoder.padSite(9000)).toEqual('9000');
       });

        it("Pads catch correctly", function() {
            expect(encoder.padCatch(9)).toEqual('009');
            expect(encoder.padCatch(90)).toEqual('090');
            expect(encoder.padCatch(900)).toEqual('900');
        });

       it("Pads quad abbreviations correctly", function() {
           expect(encoder.padQuad('R')).toEqual('R    ');
           expect(encoder.padQuad('RA')).toEqual('RA   ');
           expect(encoder.padQuad('RAN')).toEqual('RAN  ');
           expect(encoder.padQuad('RAND')).toEqual('RAND ');
           expect(encoder.padQuad('RANDM')).toEqual('RANDM');
       });
    });
});