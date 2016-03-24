'use strict';
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
    'application'
], function(Application) {
    Application();
});
