define(["jquery",
    "underscore",
    "src/util/Geolocation",
    "src/collections/NearestSiteCollection",
    "src/models/NearestSite",
    "src/models/CurrentPosition",
    "src/models/RelativePosition",
    "src/views/ManualLock"],
    function($, _, Geolocation, NearestSiteCollection, NearestSite, CurrentPosition, RelativePosition, ManualLockView) { 'use strict';
        $(describe("Manual Lock View", function() {

            it("Can be instantiated", function() {
                var view = new ManualLockView({model: new CurrentPosition()});
                expect(view).toBeDefined();
            });

            it("Has a setSelectedSite method", function() {
                var view = new ManualLockView({model: new CurrentPosition()});
                expect(view.setSelectedSite).toBeDefined();
            });

            describe("Setting the selected site", function() {

                var addNearestSites = function(nearestSites) {

                    nearestSites.add(new NearestSite({site: {
                        "zone":17,
                        "xth":"500000",
                        "yth":"4000000",
                        "quad":"NEAR",
                        "site_id":5678,
                        "grid":"8000",
                        "trap_type":"Milk Carton",
                        "moth_count":0
                    }, relativePosition: new RelativePosition()}));

                    nearestSites.add(new NearestSite({site: {
                        "zone":17,
                        "xth":"400000",
                        "yth":"3000000",
                        "quad":"FAR",
                        "site_id":1234,
                        "grid":"8000",
                        "trap_type":"Milk Carton",
                        "moth_count":0
                    }, relativePosition: new RelativePosition()}));
                };

                it("Can set the 'nearest' site in the model based on the user's selection", function() {
                    var view = new ManualLockView({model: new CurrentPosition()});

                    addNearestSites(view.model.nearestSites);

                    view.model.set('selectedSite', view.model.nearestSites.first());
                    view.selectedItem = "FAR:1234";
                    view.setSelectedSite();
                    var selected = view.model.get('selectedSite');
                    expect(selected.get('site').quad).toEqual('FAR');
                    expect(selected.get('site').site_id).toEqual(1234);
                });

                it("Can parse the selected option to a quad and site", function() {
                    var view = new ManualLockView({model: new CurrentPosition()});
                    var selectData = "ABCDE:1234";
                    var parsed = view.parseSelect(selectData);
                    expect(parsed).toEqual({quad: 'ABCDE', site_id: 1234});
                });

                it("Sets manual lock when the user chooses a site and clicks okay", function() {
                    var view = new ManualLockView({model: new CurrentPosition()});
                    addNearestSites(view.model.nearestSites);
                    view.selectedItem = "FAR:1234";
                    view.setManualLock();
                    expect(view.model.get('manualLock')).toEqual(true);
                });

                it("Does not set manual lock when the user chooses disable and clicks okay", function() {
                    var view = new ManualLockView({model: new CurrentPosition()});
                    view.selectedItem = "Disable Manual Lock";
                    view.model.set('manualLock', true);
                    view.setManualLock();
                    expect(view.model.get('manualLock')).toEqual(false);
                });
            });
        }));
    });
