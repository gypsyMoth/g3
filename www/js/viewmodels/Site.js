define(function() { 'use strict';

    var Site = function(){
        this.zone = undefined;
        this.xth = undefined;
        this.yth = undefined;
        this.xact = undefined;
        this.yact = undefined;
        this.quad = undefined;
        this.site_id = undefined;
        this.grid = undefined;
        this.trap_type = undefined;
        this.omit_reason = undefined;
        this.txn_date = undefined;
        this.moth_count = undefined;
        this.visit = undefined;
        this.condition = undefined;
        //this.pass_fail = undefined;
        this.fail_reason = undefined;
    };

    return Site;
});