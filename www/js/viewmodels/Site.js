define(['jquery',
    'knockout',
    'src/util/Controller',
    'src/viewmodels/Position'
], function($,
            ko,
            Controller,
            Position
    ) {

    'use strict';

    var Site = function() {

        this.zone = ko.observable();
        this.xth = ko.observable();
        this.yth = ko.observable();
        this.xact = ko.observable();
        this.yact = ko.observable();
        this.quad = ko.observable();
        this.site_id = ko.observable();
        this.grid = ko.observable();
        this.trap_type = ko.observable();
        this.moth_count = ko.observable();
        this.omit_reason = ko.observable();
        this.visit = ko.observable();
        this.condition = ko.observable();
        this.catch = ko.observable();
    };

    return Site;

});