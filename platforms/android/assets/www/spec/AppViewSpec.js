describe('app', function() {
    describe('initialize', function() {
        it('should bind deviceready', function() {
            runs(function() {
                spyOn(app.AppView, 'onDeviceReady');
                app.AppView.initialize();
                helper.trigger(window.document, 'deviceready');
            });

            waitsFor(function() {
                return (app.AppView.onDeviceReady.calls.length > 0);
            }, 'onDeviceReady should be called once', 500);

            runs(function() {
                expect(app.AppView.onDeviceReady).toHaveBeenCalled();
            });
        });
    });
});
