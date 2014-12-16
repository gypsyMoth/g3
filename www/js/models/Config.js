define(function() {

    'use strict';

    var Config = function(){
        this.state = undefined;
        this.initials = undefined;
        this.email = undefined;
        this.metric = false;
        this.compass = true;
        this.track = true;
        this.directUpload = false;
    };

    return Config;
});
