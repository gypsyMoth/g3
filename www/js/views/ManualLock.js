define(['jquery',
    'underscore',
    'backbone',
    'src/util/Controller',
    'src/models/NearestSite',
    'text!src/templates/manualLock.html'
], function($, _, Backbone, Controller, NearestSite, manualLockTemplate) {
    'use strict';

    var ManualLock = Backbone.View.extend({

        tagName: "div",

        className: "view",

        selectedItem: "",

        disableMessage: "Disable Manual Lock",

        initialize: function(options) {
            this.template = _.template(manualLockTemplate);
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
            var siteInfo, selectedSite, newSite;
            siteInfo = this.parseSelect(this.selectedItem);

            newSite = this.model.nearestSites.find(function(nearest) {
                var site = nearest.get('site');
                return (site.quad === siteInfo.quad && site.site_id === siteInfo.site_id);
            });

            this.model.set('selectedSite', new NearestSite({
                site: $.extend(true, {}, newSite.get('site')),
                relativePosition: $.extend(true, {}, newSite.get('relativePosition'))
            }));
            console.log(JSON.stringify(siteInfo) + "/" + newSite.get('site').quad + "/" + this.model.get('selectedSite').get('site').quad);
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
            this.$el.find('#selectSite').val(this.selectedItem);
            return this;
        }
    });

    return ManualLock;
});