require.config({
    baseUrl: 'js',
    enforceDefine: true,
    paths: {
        text: 'vendor/requirejs/text',
        templates: '../templates'
    },
    shim: {},
    urlArgs: "bust=" + (new Date()).getTime()
});

define([
    'application',
    'app/router'
], function(Application, Router) {
    Application.initialize(new Router());
});
