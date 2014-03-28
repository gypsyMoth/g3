define(['jquery',
    'underscore',
    'backbone',
    'text!templates/omit.html',
    'src/util/Controller'
], function($, _, Backbone, OmitTemplate, Controller) {
    'use strict';

    var Omit = Backbone.View.extend({

        tagName: "div",

        className: "view",

        initialize: function(options) {
            this.template = OmitTemplate;
        },

        events: {
            "click #btnOmitOk": "onOkClicked",
            "click #btnOmitCancel": "onCancelClicked",
            "change #selectOmitReason": "onOmitReasonChanged"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onOmitReasonChanged: function(e) {
            var selectedFileName = e.target.options[e.target.selectedIndex].text;
            this.selectedItem = this.collection.find(function(model) {return model.get('fileEntry').name === selectedFileName; });
        },

        onOkClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        }
    });

    return Omit;
});
