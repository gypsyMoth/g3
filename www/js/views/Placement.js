define(['underscore',
    'backbone',
    'src/util/Date',
    'src/util/Controller',
    'text!src/templates/placement.html'
], function(_, Backbone, DateFormatter, Controller, placementTemplate) { 'use strict';

    var PlacementView = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = _.template(placementTemplate);
            this.setOperationData();
        },

        events: {
            "click #btnPlacementOk": "onOkClicked",
            "click #btnPlacementOmit": "onOmitClicked",
            "click #btnPlacementCancel": "onCancelClicked",
            "change #selectTraptype": "onTraptypeChanged"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.model.get('selectedSite').get('site').site_id > 8999) {
                this.$el.find('#btnPlacementOmit').prop('disabled', true);
            }
            return this;
        },

        onOkClicked: function() {
            var relativePosition = this.model.get('selectedSite').get('relativePosition');
            if (relativePosition.get('distanceOutside') > 0) {
                Controller.router.navigate('caution', {trigger: true, replace: true});
            } else {
                Controller.router.navigate('confirm', {trigger: true, replace: true});
            }
        },

        onOmitClicked: function() {
            Controller.router.navigate('omit', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        },

        onTraptypeChanged: function(e) {
            var op = this.model.get('operation');
            var newValue = e.target.options[e.target.selectedIndex].text;
            op.traptype = newValue;
        },

        setOperationData: function() {
            var op = this.model.get('operation');
            var utm = this.model.get('currentUtm');
            var site = this.model.get('selectedSite').get('site');
            var accuracy = this.model.get('accuracy');
            op.zone = utm.Zone;
            op.easting = utm.Easting;
            op.northing = utm.Northing;
            op.accuracy = accuracy;
            op.traptype = site.trap_type;
            op.date = DateFormatter.getSitesFormatDate(Date.now());
        }
    });

    return PlacementView;
});