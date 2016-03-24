'use strict';
define([
    'app/store',
    'app/keyboard',
    'app/router',
    'views/error',
    'views/spec',
    'views/summary',
    'views/components/sidenav',
    'views/components/searchbox'
], function(store, keyboard, Router, ErrorView, SpecView, SummaryView, SidenavView, SearchboxView) {
    var views = [];
    var router = new Router();

    function setCurrentView(name, options) {
        if (views[name]) {
            $('main > .container').addClass('hidden');
            $('main > #' + name + '-container').removeClass('hidden');
            views[name].render(options);
        }
    }

    function loadReport() {
        var url = window.location.href;
        if (url.indexOf('#') > 0) {
            url = url.substr(0, url.indexOf('#'));
        }

        url = url.replace(window.location.hash, '');

        if(url.indexOf('public/index.html') > -1) {
            url = url.replace('public/index.html', 'public/results/report.json');
        } else {
            url += 'results/report.json';
        }

        return $.get(url);
    }

    function viewReport() {
        loadReport()
        .done(function(data) {
            store.setReport(data);
            if (!store.isCompleteReport()) {
                setTimeout(viewReport, 10000);
            }
        })
        .fail(function() {
            router.navigate('!/error', {
                trigger: true,
                replace: false
            });
        });
    }

    var Application = function(r) {
        new SidenavView({
            el: $('#spec-list')
        });

        new SearchboxView({
            el: $('#searchbox-container')
        });

        views['error'] = new ErrorView({
            el: $('#error-container')
        });
        views['summary'] = new SummaryView({
            el: $('#summary-container')
        });
        views['spec'] = new SpecView({
            el: $('#spec-container')
        });

        viewReport();
        $('.rediff-logo').addClass('in');
    };

    _.extend(Application, Backbone.Events);

    Application.listenToOnce(store, 'load:report', function() {
        keyboard.initialize();
        router.on('change:view', setCurrentView);
        router.start();
    });

    return Application;
});
