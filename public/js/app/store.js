define([
    'models/spec',
    'models/result'
], function(SpecModel, ResultModel) {
    var report;
    var currentViewport = null;
    var currentEnvironment = null;
    var currentSpecSlug = null;
    var searchTerm = '';

    var Store = {
        setReport: function(r) {
            var firstTime = report === undefined;
            report = r;
            report.specs.forEach(function(spec, idx) {
                spec.tests.results.forEach(function(result, resultIdx) {
                    spec.tests.results[resultIdx] = new ResultModel(result);
                });
                report.specs[idx] = new SpecModel(spec, {parse: true});
            });
            if (firstTime) {
                report.environments.diff = {};
                this.setCurrentEnvironment('diff');
                this.setCurrentViewport(_.keys(report.viewports)[0]);
            }

            this.trigger('load:report', report);
        },

        getSpecs: function() {
            return report.specs;
        },

        getReport: function() {
            return report;
        },

        isCompleteReport: function() {
            return report.metadata.tests.completed === report.metadata.tests.count;
        },

        getSpecBySlug: function(slug) {
            return !report ? null : _.find(report.specs, function(spec) {
                return spec.get('slug') === slug;
            });
        },

        setCurrentViewport: function(viewport) {
            currentViewport = viewport;
            this.trigger('change:viewport', viewport);
        },

        getEnvironments: function() {
            return report.environments;
        },

        getViewports: function() {
            return report.viewports;
        },

        getCurrentViewport: function() {
            return currentViewport;
        },

        setCurrentEnvironment: function(environment) {
            if (currentEnvironment !== environment) {
                currentEnvironment = environment;
                this.trigger('change:environment', environment);
            }
        },

        getCurrentEnvironment: function() {
            return currentEnvironment;
        },

        setCurrentSpecSlug: function(slug) {
            if (currentSpecSlug !== slug) {
                currentSpecSlug = slug;
                this.trigger('change:spec', this.getCurrentSpec());
            }
        },

        getCurrentSpec: function() {
            return report.specs.find(function(spec) {
                return spec.get('slug') === currentSpecSlug;
            });
        },

        setSearchTerm: function(term) {
            if (searchTerm !== term) {
                searchTerm = term;
                this.trigger('search', term);
            }
        },

        getSearchTerm: function() {
            return searchTerm;
        }
    };

    _.extend(Store, Backbone.Events);

    return Store;
});
