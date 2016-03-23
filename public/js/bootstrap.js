require.config({
    baseUrl: 'js',
    enforceDefine: true,
    paths: {
        'text': 'vendor/requirejs/text',
        'templates': '../templates',
        'hammerjs': [
            '//cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.6/hammer.min',
            'vendor/hammer.min'
        ],
        'materialize': [
            '//cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/js/materialize.min',
            'vendor/materialize.min'
        ]
    },
    shim: {
        'materialize': {
            deps: ['hammerjs']
        },
        'hammerjs': {
            exports: 'Hammer'
        }
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

define([
    'application',
    'app/router',
    'materialize',
    'hammerjs'
], function(Application, Router) {
    Application.initialize(new Router());
});
