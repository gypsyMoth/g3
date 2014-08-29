define(["src/models/SitesFile"], function(SitesFile) { 'use strict';

    describe("SitesFile Model", function() {
        it("Has a fileEntry member", function() {
           var sitesFileModel = new SitesFile();
           expect(sitesFileModel.get('fileEntry')).toBeDefined();
        });
    });
});
