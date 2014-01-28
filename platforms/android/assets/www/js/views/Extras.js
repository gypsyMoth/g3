/**
 * Created by Ian on 1/22/14.
 */
(function () {
    'use strict';

    app.views.Extras = Backbone.View.extend({

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
            app.db.loadSites('TX', 2).then( function() {
                app.pageRouter.navigate('home', {trigger: true, replace: true});
            });
        },

        onDownloadClicked: function() {
            app.db.downloadSites('WV', 1).then( function() {
                app.pageRouter.navigate('home', {trigger: true, replace: true});
            });
        },

        onUploadClicked: function() {
            alert("Upload Data not implemented");
            //app.pageRouter.navigate('home', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            app.pageRouter.navigate('home', {trigger: true, replace: true});
        }
    });
})();