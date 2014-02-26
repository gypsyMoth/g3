define(['underscore', 
    'backbone', 
    'src/util/DB', 
    'src/App'
], function(_, Backbone, DB, App) {
    'use strict';

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
            DB.loadSites('TX', 2).then( function(data) {
                App.SitesList = data;
                App.pageRouter.navigate('home', {trigger: true, replace: true});
            });
        },

        onDownloadClicked: function() {
            DB.downloadSites('WV', 1).then( function() {
                App.pageRouter.navigate('home', {trigger: true, replace: true});
            });
        },

        onUploadClicked: function() {
            alert("Upload Data not implemented");
            //App.pageRouter.navigate('home', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            App.pageRouter.navigate('home', {trigger: true, replace: true});
        }
    });

    return Extras;
});