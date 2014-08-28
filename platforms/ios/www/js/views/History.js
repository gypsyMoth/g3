define(['underscore', 
    'backbone',
    'src/util/Decoder',
    'src/util/Controller',
    'text!src/templates/history.html'
], function(_, Backbone, Decoder, Controller, historyTemplate) {
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
            this.template = _.template(historyTemplate);
            this.sortDate(this.collection);
            this.pages.total = Math.ceil(this.collection.models.length / this.pages.perPage);
            this.setButtons();
        },

        sortDate: function(coll) {
            coll.comparator = function(t1, t2){
                var date1 = Date.parse(t1.get("date") + " " + t1.get("time"));
                var date2 = Date.parse(t2.get("date") + " " + t2.get("time"));
                if (date1 > date2) {return -1;}
                if (date1 < date2) {return 1;}
                return 0;
            }
            coll.sort();
        },

        setButtons: function(){
            this.pages.previous = (this.pages.page > 1) ? true : false;
            this.pages.next = (this.pages.page < this.pages.total) ? true : false;
        },

        pagination : function(perPage, page) {
            page = page-1;
            var collection = this.collection;
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