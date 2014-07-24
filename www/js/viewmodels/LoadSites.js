define(['jquery',
    'underscore',
    'knockout',
    'src/util/DB',
    'src/util/Geolocation',
    'src/util/Encoder',
    'src/util/Controller'
], function($,
            _,
            ko,
            DB,
            Geolocation,
            Encoder,
            Controller
    ) {

    'use strict';

    var LoadSitesView = function() {

        this.optionsArray = ko.computed(function(){
            var files = Controller.gadget.sitesFiles();
            var array = [];
            for (var i = 0; i < files.length; i++){
                var obj = {};
                var entry = files[i].fileEntry;
                obj.label = entry.name;
                obj.fileEntry = entry;
                array.push(obj);
            }
            return array;
        }, this);

        this.selectedFile = ko.observable();

        this.loadFile = function(){
            DB.loadSites(this.selectedFile().fileEntry).then(_.bind(function (data) {
                Controller.gadget.sitesList(data);
            }, this));
            Controller.gadget.changeView('home');
        };
    };

    return LoadSitesView;

});

