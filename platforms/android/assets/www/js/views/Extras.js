define(['underscore', 
    'backbone', 
    'src/util/DB',
    'src/util/Geolocation'
], function(_, Backbone, DB, Geolocation) { 'use strict';

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
                    Backbone.history.navigate('home', {trigger: true, replace: true});
                });
            });
        },

        onDownloadClicked: function() {
            DB.initialize().then(function() {
                DB.downloadSites('WV', 1).then( function() {
                    Backbone.history.navigate('home', {trigger: true, replace: true});
                });
            });
        },

        onUploadClicked: function() {
            alert("Upload Data not implemented");
            //Backbone.history.navigate('home', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            Backbone.history.navigate('home', {trigger: true, replace: true});
        }
    });

    return Extras;
});