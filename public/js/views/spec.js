define([
    'app/view',
    'app/store',
    'application',
    'views/components/details',
    'views/components/navigation',
    'views/components/result',
    'text!templates/spec.html'
], function(View, store, Application, DetailsView, NavigationView, ResultView, viewTemplate) {
    var SpecView = View.extend({
        events: {},
        initialize: function() {
            this.listenTo(store, 'change:environment', this.onEnvironmentChange.bind(this));
            this.listenTo(store, 'change:viewport', this.onViewportChange.bind(this));
            this.listenTo(store, 'change:spec', this.onSpecChange.bind(this));
            this.listenToOnce(store, 'load:report', this.onReportLoaded.bind(this));

            this.preRender();
        },

        preRender: function() {
            this.$el.html(_.template(viewTemplate, {model: this.model}));
        },

        render: function() {
            var $result = this.$('.result-view');
            if (this.model) {
                this.model.get('tests').results.forEach(function (result) {
                    var view = this.getSubView('results-' + result.get('viewport'));
                    if(!view) {
                        view = new ResultView({
                            model: result,
                            el: $result
                        });
                        this.addSubView('results-' + result.get('viewport'), view);
                    } else {
                        view.resetModel();
                    }
                    view.render();
                }.bind(this));
            }
        },

        onSpecChange: function(spec) {
            if (!spec.hasViewport(store.getCurrentViewport())) {
                var results = spec.get('tests').results;
                if (results.length) {
                    store.setCurrentViewport(results[0].get('viewport'));
                }
            }
            if (spec) {
                this.model = spec;
                this.render();
            }
        },

        getCurrentResultsView: function() {
            return this.getSubView('results-' + store.getCurrentViewport());
        },

        onEnvironmentChange: function(environment) {
            var view = this.getCurrentResultsView();
            if (view) {
                view.onEnvironmentChange(environment);
            }
        },

        onViewportChange: function() {
            var view = this.getCurrentResultsView();
            if(view) {
                view.render();
            }
        },

        onReportLoaded: function() {
            this.addSubView('details', new DetailsView({
                el: this.$('.details')
            }));

            this.addSubView('navigation', new NavigationView({
                viewports: store.getViewports(),
                environments: store.getEnvironments(),
                el: this.$('.navigation')
            }));
        }
    });
    return SpecView;
});
