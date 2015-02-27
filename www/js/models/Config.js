define(function() {

    'use strict';

    var Config = function(){
        this.state = undefined;
        this.initials = undefined;
        this.email = undefined;
        this.metric = true;
        this.compass = true;
        this.track = true;
        this.directUpload = false;
        this.baseURL = "http://yt.ento.vt.edu/SlowTheSpread/";
        //this.baseURL = "http://testSkynet.ento.vt.edu/SlowTheSpread/";
        this.uploadURL = "TrapData";
    };

    return Config;
});
