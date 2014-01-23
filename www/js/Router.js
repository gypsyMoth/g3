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
        this.loadView(new app.views.Splash({model: app.Startup}));
    },

    home : function() {
        this.loadView(new app.views.Home({model: app.Here, template: _.template($('#home-template').html())}));
    },

    extras: function() {
        this.loadView(new app.views.Extras({model: app.Here, template: _.template($('#extras-template').html())}));
    },

    placement : function() {
        this.loadView(new app.views.Placement({model: app.Here}));
    },

    caution: function() {
        this.loadView(new app.views.Caution({model: app.Here}));
    },

    confirm: function() {
        this.loadView(new app.views.Confirm({model: app.Here}));
    },

    loadView : function(view) {
        this.view && this.view.remove();
        this.view = view;
        $("#content").append(this.view.render().el);
    }
});