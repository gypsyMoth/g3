/* Created by Ian on 1/15/14.*/
$(function () {
    'use strict';

    app.views.Home = Backbone.View.extend({

        el: '#homeView',

        template: _.template($('#home-template').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.render();
        },

        events: {
            "click #homeImage": "onImageClicked"
        },

        onImageClicked: function() {
            alert("Trap Placement");
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
});
