define(['underscore', 
    'backbone', 
    'src/util/DB',
    'src/util/Geolocation',
    'src/util/Controller',
    'src/util/Transactions'
], function(_, Backbone, DB, Geolocation, Controller, Transactions) { 'use strict';

    var Extras = Backbone.View.extend({

        tagName: "div",

        className: "view",

        hasFiles: false,

        initialize: function(options) {
            this.template = options.template;
        },

        events: {
            "click #btnExtrasLoadLocal": "onLoadLocalClicked",
            "click #btnExtrasDownload": "onDownloadClicked",
            "click #btnExtrasUpload": "onUploadClicked",
			"click #btnExtrasHistory": "onHistoryClicked",
            "click #btnExtrasCancel": "onCancelClicked"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onLoadLocalClicked: function() {
            DB.initialize().then(function() {
                DB.loadSites('TX', 2).then( function(data) {
                    Geolocation.SitesList = data;
                    Controller.router.navigate('home', {trigger: true, replace: true});
                });
            });
        },

        onDownloadClicked: function() {
            DB.initialize().then(function() {
                DB.downloadSites('WV', 1).then( function() {
                    Controller.router.navigate('home', {trigger: true, replace: true});
                });
            });
        },

        onUploadClicked: function() {
            alert("Upload Data not implemented");
            //Controller.router.navigate('home', {trigger: true, replace: true});
        },
		
		onHistoryClicked: function() {
            Controller.router.navigate('history', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        }
    });

    return Extras;
});