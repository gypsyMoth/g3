define(['underscore', 'backbone', 'src/app'], function(_, Backbone, app) {
    'use strict';

    var Caution = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = options.template;
        },

        events: {
            "click #btnCautionOk": "onOkClicked",
            "click #btnCautionCancel": "onCancelClicked"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onOkClicked: function() {
            app.pageRouter.navigate('confirm', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            app.pageRouter.navigate('home', {trigger: true, replace: true});
        }
    });

    return Caution;
});
