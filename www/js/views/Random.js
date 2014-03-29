define(['underscore',
    'backbone',
    'src/models/NearestSite',
    'src/util/Controller',
    'text!src/templates/random.html'
], function(_, Backbone, NearestSite, Controller, randomTemplate) { 'use strict';

    var Random = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = _.template(randomTemplate);
        },

        events: {
            "click #btnRandomOk": "onOkClicked",
            "click #btnRandomCancel": "onCancelClicked"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onOkClicked: function() {
            this.initRandomSite();
            Controller.router.navigate('placement', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        },

        initRandomSite: function() {
            var randomSite = this.model.get('selectedSite');
            randomSite.set('site', {quad: 'RANDM', site_id: 9001, trap_type: 'Milk Carton' });
        }
    });

    return Random;
});
