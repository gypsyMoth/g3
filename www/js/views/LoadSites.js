define(['jquery',
    'underscore',
    'backbone',
    'src/util/Controller',
    'src/util/DB',
    'src/util/Geolocation',
    'text!src/templates/loadSites.html'
], function($, _, Backbone, Controller, DB, Geolocation, loadSitesTemplate) {
    'use strict';

    var LoadSites = Backbone.View.extend({

        tagName: "div",

        className: "view",

        selectedItem: null,

        initialize: function(options) {
            this.template = _.template(loadSitesTemplate);
            this.selectedItem = this.collection.first();
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
            var selectedFileName = e.target.options[e.target.selectedIndex].text;
            this.selectedItem = this.collection.find(function(model) {return model.get('fileEntry').name === selectedFileName; });
        },

        onOkClicked: function() {
            DB.loadSites(this.selectedItem.get('fileEntry')).then(_.bind(function (data) {
                Geolocation.SitesList = data;
                Geolocation.findNearest();
                Controller.router.navigate('home', {trigger: true, replace: true});
            }, this));
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        }
    });

    return LoadSites;
});
