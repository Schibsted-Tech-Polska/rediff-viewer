'use strict';
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
            report.specs = _.sortBy(report.specs, function(spec) {
                return -spec.getAverageDiff();
            });

            report.environments.diff = {};
            if (firstTime) {
                this.setCurrentEnvironment('diff');
                this.setCurrentViewport(_.keys(report.viewports)[0]);
            }

            this.trigger('load:report', report);
        },

        hasReport: function() {
            return !!report;
        },

        getSpecs: function() {
            if (!report || !report.specs) {
                return [];
            }
            return report.specs;
        },

        getReport: function() {
            return report;
        },

        isCompleteReport: function() {
            if (!report || !report.metadata) {
                return null;
            }
            return report.metadata.tests.completed === report.metadata.tests.count;
        },

        setCurrentViewport: function(viewport) {
            currentViewport = viewport;
            this.trigger('change:viewport', viewport);
        },

        getEnvironments: function() {
            if (!report || !report.environments) {
                return null;
            }
            return report.environments;
        },

        getViewports: function() {
            if (!report || !report.viewports) {
                return null;
            }
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
            if (!report || !report.specs) {
                return null;
            }
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
