define(['underscore', 
    'backbone',
    'src/util/DB',
    'src/util/Geolocation'
], function(_, Backbone, DB, Geolocation) {
    'use strict';

    var Confirm = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = options.template;
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
            this.model.saveSites();
            DB.initialize().then(function() {
                DB.logOperation(this.model.codedString()).then( function() {
                    DB.saveSites(Geolocation.SitesList).then( function() {
                        Backbone.history.navigate('home', {trigger: true, replace: true});
                    });
                });
            });
        },

        onCancelClicked: function() {
            Backbone.history.navigate('home', {trigger: true, replace: true});
        }
    });

    return Confirm;
});
