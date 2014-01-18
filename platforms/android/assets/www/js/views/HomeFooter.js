$(function () {
    'use strict';

    app.views.HomeFooter = Backbone.View.extend({

        el: '#homeFooter',

        template: _.template($('#home-footer-template').html()),

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
