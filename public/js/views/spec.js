'use strict';
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
        rendered: false,
        initialize: function() {
            this.render();
            if (store.hasReport()) {
                this.onReportLoaded();
            } else {
                this.listenToOnce(store, 'load:report', this.onReportLoaded.bind(this));
            }
            this.listenTo(store, 'change:spec', this.onSpecChange.bind(this));
        },

        render: function() {
            if (!this.rendered) {
                this.$el.html(_.template(viewTemplate));
            }
            this.rendered = true;
        },

        onSpecChange: function(spec) {
            if (!spec.hasViewport(store.getCurrentViewport())) {
                var results = spec.get('tests').results;
                if (results.length) {
                    store.setCurrentViewport(results[0].get('viewport'));
                } else {
                    store.setCurrentViewport(null);
                }
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

            this.addSubView('results', new ResultView({
                el: this.$('.result-view')
            }));
            this.getSubView('results').render();
        }
    });
    return SpecView;
});
