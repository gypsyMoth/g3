define(['underscore',
    'backbone',
    'src/app',
    'src/views/Splash',
    'src/views/Home',
    'src/views/Extras',
    'src/views/Placement',
    'src/views/Caution',
    'src/views/Confirm'
], function(_, Backbone, app, SplashView, HomeView, ExtrasView, PlacementView, CautionView, ConfirmView) {

    var Router = Backbone.Router.extend({
        routes : {
            "splash" : "splash",
            "home" : "home",
            "extras" : "extras",
            "placement" : "placement",
            "caution" : "caution",
            "confirm" : "confirm"
        },

        splash: function() {
            this.loadView(new SplashView({model: app.Startup, template: _.template($('#splash-template').html())}));
        },

        home : function() {
            this.loadView(new HomeView({model: app.Here, template: _.template($('#home-template').html())}));
        },

        extras: function() {
            this.loadView(new ExtrasView({model: new app.models.Filesystem, template: _.template($('#extras-template').html())}));
        },

        placement : function() {
            this.loadView(new PlacementView({model: app.Here, template: _.template($('#placement-template').html())}));
        },

        caution: function() {
            this.loadView(new CautionView({model: app.Here, template: _.template($('#caution-template').html())}));
        },

        confirm: function() {
            this.loadView(new ConfirmView({model: app.Here, template: _.template($('#confirm-template').html())}));
        },

        loadView : function(view) {
            this.view && this.view.remove();
            this.view = view;
            $("#content").append(this.view.render().el);
        }
    });

    return Router;
});