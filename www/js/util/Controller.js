define (function () { 'use strict';

    var my = {};

    my.errors = {
        network: "Network connection error! Please ensure that you are connected to the internet and try again.",
        timeout: "Network connection lost or timed out! Please ensure that you are connected to the internet and try again.",
        sites: "No sites file! Please ensure you have an internet connection, then restart the app to download a sites file.",
        upload: "Unable to upload activity file to server! Please wait five minutes and try again. If problems persist, please contact technical support.",
        server: "Unable to reach server. Please ensure you have full internet access in a web browser and try again."
    };

    return my;
});
