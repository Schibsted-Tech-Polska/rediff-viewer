define([
    'app/store',
    'utils',
    'app/view',
    'text!templates/spec/navigation.html',
    'text!templates/spec/viewports.html',
    'text!templates/radial-progress.html'
], function(store, utils, View, viewTemplate, viewportsTemplate, gaugeTemplate) {

    function renderGauge(icon, progress) {
        return _.template(gaugeTemplate, {
            progress: progress,
            content: '<i class="material-icons">' + icon + '</i>',
            color: {
                inner: 'blue lighten-1',
                ring: 'blue lighten-2'
            }
        });
    }

    var $dom = {
        tabs: $([]),
        viewports: $([])
    };

    var NavigationView = View.extend({
        events: {
            'click [data-toggle="environment"]': 'onEnvironmentClick',
            'click [data-toggle="viewport"]': 'onViewportClick'
        },
        initialize: function() {
            this.listenTo(store, 'load:report', this.onReportLoaded.bind(this));
            this.listenTo(store, 'change:spec', this.onSpecChange.bind(this));
            this.listenTo(store, 'change:environment', this.onEnvironmentChange.bind(this));
            this.listenTo(store, 'change:viewport', this.onViewportChange.bind(this));

            this.render();
        },

        render: function() {
            this.model = store.getCurrentSpec();
            this.$el.html(_.template(viewTemplate, {
                environments: store.getEnvironments()
            }));

            $dom = {
                tabs: this.$('ul.tabs'),
                viewports: this.$('.viewports li')
            };

            $dom.tabs.tabs();
        },

        onReportLoaded: function() {
            this.onSpecChange(store.getCurrentSpec());
        },

        onSpecChange: function(spec) {
            if (spec) {
                this.model = spec;
                this.onEnvironmentChange(store.getCurrentEnvironment());
                this.onViewportChange(store.getCurrentViewport());
            }
        },

        onEnvironmentChange: function(env) {
            $dom.tabs.tabs('select_tab', env);
        },

        onViewportChange: function(viewport) {
            var currentSpec = store.getCurrentSpec();
            var available = currentSpec.getAvailableViewports();
            var viewports = store.getViewports();
            var data = _.keys(viewports).map(function(viewportName) {
                var result = currentSpec.getResultForViewport(viewportName);
                var className = '';
                if (available.indexOf(viewportName) < 0) {
                    className = 'disabled';
                } else if (viewportName === viewport) {
                    className = 'active';
                }

                return {
                    name: viewportName,
                    className: className,
                    diff: result ? result.get('diff') : 0,
                    icon: viewports[viewportName].icon
                };
            });
            this.$('#viewports').html(_.template(viewportsTemplate, {
                viewports: data,
                renderGauge: renderGauge
            }));
            var currentSpec = store.getCurrentSpec();
            var available = currentSpec.getAvailableViewports();
            var viewports = store.getViewports();
            var data = _.keys(viewports).map(function(viewportName) {
                var className = '';
                if (available.indexOf(viewportName) < 0) {
                    className = 'disabled';
                } else if (viewportName === viewport) {
                    className = 'active';
                }

                return {
                    name: viewportName,
                    className: className,
                    diff: currentSpec.getDiffForViewport(viewportName),
                    icon: viewports[viewportName].icon
                };
            });
            this.$('#viewports').html(_.template(viewportsTemplate, {
                viewports: data,
                renderGauge: renderGauge
            }));
        },

        // Event listeners
        onEnvironmentClick: function(event) {
            event.preventDefault();
            store.setCurrentEnvironment($(event.currentTarget).data('env'));
        },

        onViewportClick: function(event) {
            event.preventDefault();
            store.setCurrentViewport($(event.currentTarget).data('viewport'));
        }
    });
    return NavigationView;
});
