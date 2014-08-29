define(['underscore', 'backbone'], function(_, Backbone) { 'use strict';

    var SplashModel = Backbone.Model.extend({
        defaults: {
            message: 'Slow the Spread of the Gypsy Moth'
        }
    });

    return SplashModel;
});