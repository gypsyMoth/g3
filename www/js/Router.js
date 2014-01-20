/**
 * Created by Ian on 1/18/14.
 */
app.Router = Backbone.Router.extend({
    routes : {
        "home" : "home",
        "placement" : "placement"
    },
    home : function() {
        this.loadView(new app.views.Home({model: app.Here}));
    },
    placement : function() {
        this.loadView(new app.views.Placement({model: app.Here}));
    },
    loadView : function(view) {
        this.view && this.view.remove();
        this.view = view;
    }
});