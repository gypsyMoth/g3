/* Created by Ian on 1/15/14.*/

describe("DB Module", function() {

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

            describe("Saving sites to the local filesystem", function() {

                it("Has a property to hold the currently loaded sites file", function() {
                    expect(app.db.sitesFile).toBeDefined();
                });

                it("Has a method to save sites to local storage", function() {
                    expect(app.db.saveSites).toBeDefined();
                });
            });

            describe("Appending to transaction log", function() {
               it("Has a method to write a transaction to the log", function() {
                   expect(app.db.logOperation).toBeDefined();
               });

               it("Has a property to store the name of the activity log", function() {
                   expect(app.db.activityLog).toBeDefined();
               });

               it("Can append data to the activity log", function() {

               });
            });
        })
    );
});