define([
    'app/store',
    'utils',
    'app/view',
    'text!templates/spec/navigation.html',
    'text!templates/radial-progress.html'
], function(store, utils, View, viewTemplate, gaugeTemplate) {

    function renderGauge(icon) {
        return _.template(gaugeTemplate, {
            progress: 0,
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

    var viewports = {};
    var viewportNames = [];
    var environments = [];

    var NavigationView = View.extend({
        events: {
            'click [data-toggle="environment"]': 'onEnvironmentClick',
            'click [data-toggle="viewport"]': 'onViewportClick'
        },
        initialize: function() {
            viewports = store.getViewports();
            viewportNames = _.keys(viewports);

            environments = _.keys(store.getEnvironments());
            var idx = environments.indexOf('diff');
            environments.splice(idx, 1);
            environments.unshift('diff');

            this.listenTo(store, 'load:report', this.onReportLoaded.bind(this));
            this.listenTo(store, 'change:spec', this.onSpecChange.bind(this));
            this.listenTo(store, 'change:environment', this.onEnvironmentChange.bind(this));
            this.listenTo(store, 'change:viewport', this.onViewportChange.bind(this));

            this.render();
        },

        render: function() {
            this.model = store.getCurrentSpec();
            this.$el.html(_.template(viewTemplate, {
                model: this.model,
                utils: utils,
                viewports: viewports,
                environments: environments,
                renderGauge: renderGauge
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

                $dom.viewports.find('[data-progress]').data('progress', 0);
                spec.get('tests').results.forEach(function(result) {
                    $dom.viewports.find('[data-viewport="' + result.get('viewport') + '"] [data-progress]')
                        .attr('data-progress', parseInt(result.get('diff')));
                });
            }
        },

        onEnvironmentChange: function(env) {
            $dom.tabs.tabs('select_tab', env);
        },

        onViewportChange: function(viewport) {
            $dom.viewports.removeClass('active disabled');
            this.$('[data-viewport=' + store.getCurrentViewport() + ']').parent().addClass('active');
            if (this.model) {
                $dom.viewports.each(function(id, elm) {
                    var $elm = $(elm);
                    if (!this.model.hasViewport($elm.find('a').data('viewport'))) {
                        $elm.addClass('disabled');
                    }
                }.bind(this));
            }
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
