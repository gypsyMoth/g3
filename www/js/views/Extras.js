/**
 * Created by Ian on 1/22/14.
 */
$(function () {
    'use strict';

    app.views.Extras = Backbone.View.extend({

        tagName: "div",

        className: "view",

        template: _.template($('#extras-template').html()),

        initialize: function() {

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
            alert("Load Local Sites");
            app.pageRouter.navigate('home', {trigger: true, replace: true});
        },

        onDownloadClicked: function() {
            alert("Download Sites");
            app.pageRouter.navigate('home', {trigger: true, replace: true});
        },

        onUploadClicked: function() {
            alert("Upload Data");
            app.pageRouter.navigate('home', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            app.pageRouter.navigate('home', {trigger: true, replace: true});
        }
    });
});