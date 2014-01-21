/*Created by Ian on 1/18/14.*/
app.Router = Backbone.Router.extend({
    routes : {
        "splash" : "splash",
        "home" : "home",
        "placement" : "placement",
        "caution" : "caution",
        "confirm" : "confirm"
    },

    splash: function() {
        this.loadView(new app.views.Splash({model: app.Startup}));
    },

    home : function() {
        this.loadView(new app.views.Home({model: app.Here}));
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