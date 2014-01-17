/**
 * Created by Ian on 1/15/14.
 */

var app = app || {};

(function ($) {
    'use strict';

    app.HomeView = Backbone.View.extend({

//        tagName: 'div',

        el: 'body',

        template: _.template($('#home-template').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
})(jQuery);