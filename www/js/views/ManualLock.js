define(['jquery',
    'underscore',
    'backbone',
    'src/util/Controller'
], function($, _, Backbone, Controller) {
    'use strict';

    var ManualLock = Backbone.View.extend({

        tagName: "div",

        className: "view",

        selectedItem: "",

        disableMessage: "Disable Manual Lock",

        initialize: function(options) {
            this.template = options.template;
            var site = this.model.get('selectedSite').get('site');
            this.selectedItem = site.quad + ":" + site.site_id;
        },

        events: {
            "click #btnManualLockOk": "onOkClicked",
            "click #btnManualLockCancel": "onCancelClicked",
            "change #selectSite": "onSiteChanged"
        },

        onSiteChanged: function(e) {
            this.selectedItem = String(e.target.options[e.target.selectedIndex].text);
        },

        onOkClicked: function() {
            this.setManualLock();
            Controller.router.navigate('home', {trigger: true, replace: true});
        },

        onCancelClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        },

        setManualLock: function() {
            if (this.selectedItem !== this.disableMessage) {
                this.setSelectedSite();
                this.model.manualLock = true;
            } else {
                this.model.manualLock = false;
            }
        },

        setSelectedSite: function() {
            var siteInfo = this.parseSelect(this.selectedItem),
                selectedSite = _.clone(this.model.get('selectedSite')),
                newSite = this.model.nearestSites.find(function(nearest) {
                    var site = nearest.get('site');
                    return (site.quad === siteInfo.quad && site.site_id === siteInfo.site_id);
                });
            selectedSite.set({site: newSite.get('site'), relativePosition: newSite.get('relativePosition')});
            this.model.set('selectedSite', selectedSite);
        },

        parseSelect: function(selectData) {
            var parts = String(selectData).split([':']);
            return {quad: parts[0], site_id: parseInt(parts[1])};
        },

        render: function() {
            this.$el.html(this.template(
                {disableMessage: this.disableMessage, nearestSites: _.filter(this.model.nearestSites.pluck('site'), function(site) {
                    return (site.quad !== '' && site.site_id !== '');
                })
            }));
            return this;
        }
    });

    return ManualLock;
});