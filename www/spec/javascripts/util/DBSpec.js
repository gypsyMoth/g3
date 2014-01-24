/* Created by Ian on 1/15/14.*/

describe("DB Module", function() {

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


                it("has a method to save sites to local storage", function() {
                    expect(app.db.saveSites).toBeDefined();
                });
            })
        );
    });
});