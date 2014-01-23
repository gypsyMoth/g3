/* Created by Ian on 1/15/14.*/

describe("db", function() {

    describe("Init", function() {
        app.db.initialize().then(
            describe("After initialization", function() {
                it("Has filesystem and root defined", function(done) {
                    app.db.initialize().then( function() {
                    expect(app.Filesystem).toBeDefined();
                    expect(app.Root).toBeDefined();
               },
               function(error){
                console.log(expect());
                expect("initialize received error: " + error).toFail();
               })
               .always(done);
                });

                it("Can check for files in local storage", function(done) {
                    app.db.countFiles().then( function() {
                            expect(app.fileCount).toBeDefined();
                        },
                        function(error){
                            console.log(expect());
                            expect("file count received error: " + error).toFail();
                        })
                        .always(done);
                });

//                it("Can load sites from a file on local storage", function(done) {
//                    app.SitesList = [];
//                    app.db.loadLocal().then( function() {
//                        expect(app.SitesList.length).toEqual
//                    });
//                });

                //This won't work, since we can't test against the phonegap API
//                it("Can download a sites file from the server", function(done) {
//                   app.db.downloadSites().then( function() {
//                    expect(app.db.currentFile).toBeDefined();
//                   });
//                });
            })
        );
    });
});