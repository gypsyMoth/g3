define(['underscore', 
    'backbone', 
    'src/App', 
    'src/util/DB'
], function(_, Backbone, App, DB) {
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
                    DB.saveSites(App.SitesList).then( function() {
                        App.pageRouter.navigate('home', {trigger: true, replace: true});
                    });
                });
            });
        },

        onCancelClicked: function() {
            App.pageRouter.navigate('home', {trigger: true, replace: true});
        }
    });

    return Confirm;
});
