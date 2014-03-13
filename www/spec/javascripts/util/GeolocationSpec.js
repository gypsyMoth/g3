define(['src/util/Geolocation'], function(Geolocation) { 'use strict';
    describe("Geolocation Module", function() {
        it("Has a start method", function() {
            expect(Geolocation.start).toBeDefined();
        });

        it("Has a stop method", function() {
            expect(Geolocation.stop).toBeDefined();
        });

        it("Has a manualLock property", function() {
           expect(Geolocation.manualLock).toBeDefined();
        });

        it("Doesn't update the nearest site when manualLock is set", function() {
           Geolocation.manualLock = true;

            var position = {
                coords: {
                    latitude: 37,
                    longitude: -81,
                    accuracy: 10
                }
            };

           spyOn(Geolocation, "findNearest");
           Geolocation.onPositionUpdate(position);

           expect(Geolocation.findNearest).not.toHaveBeenCalled();
        });
    });
});
