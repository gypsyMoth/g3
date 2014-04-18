define(['underscore', 
    'backbone',
    'src/util/DB',
    'src/util/Geolocation',
    'src/util/Controller',
    'text!src/templates/confirm.html'
], function(_, Backbone, DB, Geolocation, Controller, confirmTemplate) {
    'use strict';

    var Confirm = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = _.template(confirmTemplate);
        },

        events: {
            "click #btnConfirmOk": "onOkClicked",
            "click #btnConfirmCancel": "onCancelClicked"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onOkClicked: function() {
            var self, site;
            self = this;

            // Fix this for inspections...
            site = self.model.get('selectedSite').get('site');
            if (site.site_id > 8999) {
                Geolocation.addRandomSite(site);
            }
            self.model.saveSites();
            DB.initialize().then(function() {
                DB.logOperation(self.model.codedString()).then( function() {
                    DB.saveSites(Geolocation.SitesList).then( function() {
                        self.model.clearOperation();
                        Controller.router.navigate('home', {trigger: true, replace: true});
                    });
                });
            });
            self.model.set('manualLock', false);
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        }
    });

    return Confirm;
});
