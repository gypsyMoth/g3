define(['underscore', 'backbone', 'src/app'], function(_, Backbone, app) {
    'use strict';

    app.views.Confirm = Backbone.View.extend({

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
            app.db.logOperation(this.model.codedString()).then( function() {
                app.db.saveSites(app.SitesList).then( function() {
                    app.pageRouter.navigate('home', {trigger: true, replace: true});
                });
            });
        },

        onCancelClicked: function() {
            app.pageRouter.navigate('home', {trigger: true, replace: true});
        }
    });
});
