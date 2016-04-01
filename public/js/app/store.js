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
            report.specs = report.specs || [];
            report.viewports = report.viewports || {};
            report.environments = report.environments || {};
            report.metadata = report.metadata || {};

            report.specs.forEach(function(spec, idx) {
                spec.tests.results.forEach(function(result, resultIdx) {
                    spec.tests.results[resultIdx] = new ResultModel(result);
                });
                report.specs[idx] = new SpecModel(spec, {parse: true});
            });
            report.specs = _.sortBy(report.specs, function(spec) {
                var avgDiff = spec.getAverageDiff();
                return isNaN(avgDiff) ? 1 : -avgDiff;
            });

            report.environments.diff = {};

            this.trigger('load:report', report);

            if (firstTime) {
                this.setCurrentEnvironment('diff');
                this.setCurrentViewport(_.keys(report.viewports)[0]);
            }
        },

        hasReport: function() {
            return !!report;
        },

        getSpecs: function() {
            if (!report) {
                return [];
            }
            return report.specs;
        },

        getReport: function() {
            return report;
        },

        isCompleteReport: function() {
            if (!report) {
                return false;
            }
            return report.metadata.tests.completed === report.metadata.tests.count;
        },

        setCurrentViewport: function(viewport) {
            currentViewport = viewport;
            this.trigger('change:viewport', viewport);
        },

        getEnvironments: function() {
            if (!report) {
                return null;
            }
            return report.environments;
        },

        getViewports: function() {
            if (!report) {
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
