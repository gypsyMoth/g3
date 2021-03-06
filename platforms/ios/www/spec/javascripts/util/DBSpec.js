define(["src/util/DB"], function(db) { 'use strict';

    describe("DB Module", function() {

            it("Returns only files ending in .json, given an array of Entries", function() {
                var entries = [
                    {isFile: false, name: "Subdir"},
                    {isFile: true, name: "trans_log.txt"},
                    {isFile: true, name: "TX_1.json"},
                    {isFile: true, name: "TX_2.JSON"}
                ];

                var expectedResults = [
                    {isFile: true, name: "TX_1.json"},
                    {isFile: true, name: "TX_2.JSON"}
                ];

                var results = db.filterSitesFiles(entries);
                expect(results).toEqual(expectedResults);
            });

//        db.initialize().then(
//            describe("After initialization", function() {
//                it("Has filesystem and root defined", function(done) {
//                    db.initialize().then( function() {
//                    expect(db.filesystem).toBeDefined();
//                    expect(db.root).toBeDefined();
//               },
//               function(error){
//                console.log(expect());
//                expect("initialize received error: " + error).toFail();
//               })
//               .always(done);
//                });
//
//                it("Can check for files in local storage", function(done) {
//                    db.countFiles().then( function() {
//                            expect(db.fileCount).toBeDefined();
//                        },
//                        function(error){
//                            console.log(expect());
//                            expect("file count received error: " + error).toFail();
//                        })
//                        .always(done);
//                });
//
//                describe("Saving sites to the local filesystem", function() {
//
//                    it("Has a property to hold the currently loaded sites file", function() {
//                        expect(db.sitesFile).toBeDefined();
//                    });
//
//                    it("Has a method to save sites to local storage", function() {
//                        expect(db.saveSites).toBeDefined();
//                    });
//                });
//
//                describe("Appending to transaction log", function() {
//                   it("Has a method to write a transaction to the log", function() {
//                       expect(db.logOperation).toBeDefined();
//                   });
//
//                   it("Has a property to store the name of the activity log", function() {
//                       expect(db.activityLog).toBeDefined();
//                   });
//                });
//            })
//        );
    });
});