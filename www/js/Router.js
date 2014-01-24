/*Created by Ian on 1/18/14.*/
app.Router = Backbone.Router.extend({
    routes : {
        "splash" : "splash",
        "home" : "home",
        "extras" : "extras",
        "placement" : "placement",
        "caution" : "caution",
        "confirm" : "confirm"
    },

    splash: function() {
        this.loadView(new app.views.Splash({model: app.Startup, template: _.template($('#splash-template').html())}));
    },

    home : function() {
        this.loadView(new app.views.Home({model: app.Here, template: _.template($('#home-template').html())}));
    },

    extras: function() {
        this.loadView(new app.views.Extras({model: new app.models.Filesystem, template: _.template($('#extras-template').html())}));
    },

    placement : function() {
        this.loadView(new app.views.Placement({model: app.Here, template: _.template($('#placement-template').html())}));
    },

    caution: function() {
        this.loadView(new app.views.Caution({model: app.Here, template: _.template($('#caution-template').html())}));
    },

    confirm: function() {
        this.loadView(new app.views.Confirm({model: app.Here, template: _.template($('#confirm-template').html())}));
    },

    loadView : function(view) {
        this.view && this.view.remove();
        this.view = view;
        $("#content").append(this.view.render().el);
    }
});