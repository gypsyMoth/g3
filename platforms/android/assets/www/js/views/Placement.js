/**
 * Created by Ian on 1/18/14.
 */
$(function () {
    'use strict';

    app.views.Placement = Backbone.View.extend({

        tagName: "div",

        className: "view",

        template: _.template($('#placement-template').html()),

        initialize: function() {

        },

        events: {
            "click #btnPlacementOk": "onOkClicked",
            "click #btnPlacementOmit": "onOmitClicked",
            "click #btnPlacementCancel": "onCancelClicked"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onOkClicked: function() {
            var site = this.model.get("relativePosition");
            if (site.DistanceOutside > 0) {
                app.pageRouter.navigate('caution', {trigger: true, replace: true});
            } else {
                app.pageRouter.navigate('confirm', {trigger: true, replace: true});
            }
        },

        onOmitClicked: function() {
            alert("Omit is not implemented");
        },

        onCancelClicked: function() {
            app.pageRouter.navigate('home', {trigger: true, replace: true});
        }
    });
});