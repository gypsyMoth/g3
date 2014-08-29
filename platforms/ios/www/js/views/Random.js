define(['jquery',
    'underscore',
    'backbone',
    'src/models/NearestSite',
    'src/models/RelativePosition',
    'src/util/Geolocation',
    'src/util/Controller',
    'text!src/templates/random.html'
], function($, _, Backbone, NearestSite, RelativePosition, Geolocation, Controller, randomTemplate) { 'use strict';

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
            var utm, nextId, randomSite;

            this.model.set('manualLock', false);
            
            utm = this.model.get('currentUtm');
            nextId = Geolocation.getNextRandomSiteId();

            randomSite = new NearestSite({
                site: {
                    quad: 'RANDM', site_id: nextId, trap_type: 'Milk Carton', zone: utm.Zone, xth: utm.Easting, yth: utm.Northing, grid: 100
                },
                relativePosition: new RelativePosition({distance: 0, bearing: null, distanceOutside: -1, found: true})
            });

            // To get eventing to work...
            this.model.set('selectedSite', randomSite);
            this.model.get('selectedSite').set('relativePosition', randomSite.get('relativePosition'));
            this.model.get('selectedSite').set('site', randomSite.get('site'));
        }

    });

    return Random;
});
