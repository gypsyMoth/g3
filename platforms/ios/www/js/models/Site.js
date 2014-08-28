define(['underscore', 'backbone', 'src/models/RelativePosition'], function(_, Backbone, RelativePosition) { 'use strict';

    var Site = Backbone.Model.extend({
        defaults: {
            zone: '',
            xth: '',
            yth: '',
            xact: '',
            yact: '',
            quad: '',
            site_id: '',
            grid: '',
            trap_type: '',
            visit: '',
            condition: '',
            moth_count: '',
            omit_reason: '',
            txn_date: ''
        }
    });

    return Site;
});