/* Created by Ian on 1/20/14.*/
$(function () {
    'use strict';

    app.views.Caution = Backbone.View.extend({

        tagName: "div",

        className: "view",

        template: _.template($('#caution-template').html()),

        initialize: function() {

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
});
