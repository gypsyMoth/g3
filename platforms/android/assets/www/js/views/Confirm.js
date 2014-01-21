/**
 * Created by Ian on 1/20/14.
 */
$(function () {
    'use strict';

    app.views.Confirm = Backbone.View.extend({

        tagName: "div",

        className: "view",

        template: _.template($('#confirm-template').html()),

        initialize: function() {

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
            // TODO: Save the data
            app.pageRouter.navigate('home', true);
        },

        onCancelClicked: function() {
            app.pageRouter.navigate('home', true);
        }
    });
});
