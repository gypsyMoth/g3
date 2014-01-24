/*Created by Ian on 1/18/14.*/
(function () {
    'use strict';

    app.views.Placement = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = options.template;
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
        },

        onTraptypeChanged: function(e) {
            var op = this.model.get('operation');
            var newValue = e.target.options[e.target.selectedIndex].text;
            op.traptype = newValue;
        },

        setOperationData: function() {
            var op = this.model.get('operation');
            var utm = this.model.get('currentUtm');
            var site = this.model.get('site');
            op.easting = utm.Easting;
            op.northing = utm.Northing;
            op.traptype = site.trap_type;
            op.date = app.DateFormatter.getSitesFormatDate();
        }

    });
})();