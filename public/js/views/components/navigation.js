'use strict';
define([
    'app/store',
    'app/view',
    'text!templates/spec/navigation.html',
    'text!templates/spec/viewports.html',
    'text!templates/radial-progress.html'
], function(store, View, viewTemplate, viewportsTemplate, gaugeTemplate) {
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
            this.listenTo(store, 'change:spec', this.onSpecChange.bind(this));
            this.listenTo(store, 'change:environment', this.onEnvironmentChange.bind(this));
            this.listenTo(store, 'change:viewport', this.onViewportChange.bind(this));

            this.render();
            this.onViewportChange();
        },

        render: function() {
            if (store.hasReport()) {
                this.$el.html(_.template(viewTemplate, {
                    environments: store.getEnvironments()
                }));

                $dom = {
                    tabs: this.$('ul.tabs'),
                    viewports: this.$('.viewports li')
                };

                if ($dom.tabs) {
                    $dom.tabs.tabs();
                }
            }
        },

        onSpecChange: function(spec) {
            if (spec) {
                this.onEnvironmentChange();
                this.onViewportChange();
            }
        },

        onEnvironmentChange: function() {
            var env = store.getCurrentEnvironment();
            if ($dom.tabs) {
                $dom.tabs.tabs('select_tab', env);
            }
        },

        onViewportChange: function() {
            var currentSpec = store.getCurrentSpec();
            var viewport = store.getCurrentViewport();
            if (!currentSpec) {
                return;
            }
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
                    diff: result ? result.getDiff() : 0,
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
