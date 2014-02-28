define(['underscore', 
    'backbone',
    'src/util/DB',
    'src/util/Geolocation',
    'src/util/Controller'
], function(_, Backbone, DB, Geolocation, Controller) {
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
            DB.initialize().then(_.bind(function() {
                DB.logOperation(this.model.codedString()).then( function() {
                    DB.saveSites(Geolocation.SitesList).then( function() {
                        Controller.router.navigate('home', {trigger: true, replace: true});
                    });
                });
            }), this);
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        }
    });

    return Confirm;
});
