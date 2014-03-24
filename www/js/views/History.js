define(['underscore', 
    'backbone',
    'src/util/Decoder',
    'src/util/Controller'
], function(_, Backbone, Decoder, Controller) {
    'use strict';

    var History = Backbone.View.extend({

        tagName: "div",

        className: "view",

        pages: {
            page: 1,
            total: 0,
            perPage: 5,
            next: false,
            previous: false
        },

        initialize: function(options) {
            this.template = options.template;
            this.sortDate();
            this.pages.total = Math.ceil(this.collection.models.length / this.pages.perPage);
            this.setButtons();
        },

        sortDate: function() {
            this.collection.comparator = function(t1, t2){
                var date1 = Date.parse(t1.get("date"));
                var date2 = Date.parse(t2.get("date"));
                if (date1 > date2) {return -1};
                if (date1 < date2) {return 1};
                return 0;
            }
            this.collection.sort();
        },

        setButtons: function(){
            this.pages.previous = (this.pages.page > 1) ? true : false;
            this.pages.next = (this.pages.page < this.pages.total) ? true : false;
        },

        pagination : function(perPage, page) {
            page = page-1;
            var collection = this.collection;
            collection.comparator = "date";
            collection = _(collection.rest(perPage*page));
            collection = _(collection.first(perPage));
            return collection.map( function(model) {
                    var message = "";
                    message = Decoder.historyString(model);
                    return message
                });
        },

        events: {
            "click #btnHistoryNext": "onNextClicked",
            "click #btnHistoryPrev": "onPrevClicked",
            "click #btnHistoryClose": "onCloseClicked"
        },

        render: function() {
            this.setButtons();
            this.$el.html(this.template({messages: this.pagination(this.pages.perPage,this.pages.page), pages: this.pages}));
            return this;
        },

        onNextClicked: function() {
            this.pages.page += 1;
            this.render();
        },

        onPrevClicked: function() {
            this.pages.page -= 1;
            this.render();
        },

        onCloseClicked: function() {
            Controller.router.navigate('home', {trigger: true, replace: true});
        }
    });

    return History;
});
