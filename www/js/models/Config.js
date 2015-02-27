define(function() {

    'use strict';

    var Config = function(){
        this.state = undefined;
        this.initials = undefined;
        this.email = undefined;
        this.metric = true;
        this.compass = true;
        this.track = true;
        this.directUpload = true;
        this.uploadURL = "TrapData";
    };

    return Config;
});
