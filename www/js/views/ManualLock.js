define(['jquery',
    'underscore',
    'backbone',
    'src/util/Controller'
], function($, _, Backbone, Controller) {
    'use strict';

    var ManualLock = Backbone.View.extend({

        tagName: "div",

        className: "view",

        selectedItem: null,

        initialize: function(options) {
            this.template = options.template;
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
        }
    });

    return ManualLock;
});