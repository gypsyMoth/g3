define(['underscore', 'backbone', 'src/app', 'src/util/DB'], function(_, Backbone, app, db) {
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
            db.logOperation(this.model.codedString()).then( function() {
                db.saveSites(app.SitesList).then( function() {
                    app.pageRouter.navigate('home', {trigger: true, replace: true});
                });
            });
        },

        onCancelClicked: function() {
            app.pageRouter.navigate('home', {trigger: true, replace: true});
        }
    });

    return Confirm;
});
