define(['jquery',
    'knockout'
], function($,
            ko
    ) {

    'use strict';

    var HomeView = function() {

        this.message = ko.observable('It is nice to be home...');

    };

    return HomeView;

});
