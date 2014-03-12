define(['jquery',
    'underscore',
    'backbone',
    'src/util/Controller',
    'src/util/DB',
    'src/util/Geolocation'
], function($, _, Backbone, Controller, DB, Geolocation) {
    'use strict';

    var LoadSites = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = options.template;
        },

        events: {
            "click #btnLoadSitesOk": "onOkClicked",
            "click #btnLoadSitesCancel": "onCancelClicked",
            "change #selectSitesFile": "onSitesFileChanged"
        },

        render: function() {
            this.$el.html(this.template({sitesFiles: this.collection.models}));
            return this;
        },

        onSitesFileChanged: function(e) {
            //var newValue = e.target.options[e.target.selectedIndex].text;
        },

        onOkClicked: function() {
            //DB.loadSites(sitesFile).then(_.bind(function (data) {
                //Geolocation.SitesList = data;
                Controller.router.navigate('home', {trigger: true, replace: true});
            //}, this));

        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        }
    });

    return LoadSites;
});
