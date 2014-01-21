/**
 * Created by Ian on 1/20/14.
 */
$(function () {
    'use strict';

    app.views.Confirm = Backbone.View.extend({

        tagName: "div",

        className: "view",

        template: _.template($('#placement-template').html()),

        initialize: function() {

        },

        events: {
            "click #btnPlace": "onConfirmClicked",
            "click #btnCancel": "onCancelClicked"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onPlaceClicked: function() {
            alert("Place");
            app.pageRouter.navigate('home', true);
        },

        onOmitClicked: function() {
            alert("Omit");
            app.pageRouter.navigate('home', true);
        },

        onCancelClicked: function() {
            alert("Cancel");
            app.pageRouter.navigate('home', true);
        }
    });
});