/* Created by Ian on 1/15/14.*/
$(function () {
    'use strict';

    app.views.HomeHeader = Backbone.View.extend({

        el: '#homeHeader',

        template: _.template($('#home-header-template').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            //this.render();
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
});