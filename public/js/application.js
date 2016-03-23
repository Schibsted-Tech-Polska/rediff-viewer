define([
    'utils',
    'app/store',
    'app/keyboard',
    'views/error',
    'views/spec',
    'views/summary',
    'views/components/sidenav',
    'views/components/searchbox'
], function(utils, store, keyboard, ErrorView, SpecView, SummaryView, SidenavView, SearchboxView) {
    var instance;
    var views = [];

    var Application = {
        initialize: function(router) {
            $('.rediff-logo').addClass('in');

            this.initializeRouter(router);

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

            this.viewReport();
        },
        initializeRouter: function(router) {
            this.router = router;

            this.listenToOnce(store, 'load:report', function() {
                this.router.on('change:view', function(view, options) {
                    this.setCurrentView(view, options);
                }, this);

                this.router.start();
            }.bind(this));
        },
        loadReport: function() {
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
        },
        viewReport: function() {
            this.loadReport()
                .done(function(data) {
                    store.setReport(data);
                    keyboard.initialize();
                    if (!store.isCompleteReport()) {
                        setTimeout(this.viewReport.bind(this), 10000);
                    }
                }.bind(this))
                .fail(function() {
                    this.router.navigate('!/error', {
                        trigger: true,
                        replace: false
                    });
                }.bind(this));

        },
        setCurrentView: function(name, options) {
            if (views[name]) {
                $('main > .container').addClass('hidden');
                $('main > #' + name + '-container').removeClass('hidden');
                views[name].render(options);
            }
        }
    };

    if(!instance) {
        instance = _.extend(Application, Backbone.Events);
    }

    return instance;
});
