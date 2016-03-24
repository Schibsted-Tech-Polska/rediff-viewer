define([], function() {
    var SpecModel = Backbone.Model.extend({
        defaults: {},
        parse: function(data) {
            return data;
        },
        getAverageDiff: function() {
            var results = this.get('tests').results;
            return Math.ceil(results.reduce(function(sum, result) {
                    return sum + result.get('diff');
                }, 0) / results.length);
        },
        getSlug: function() {
            return this.get('name').replace(/ /g, '-')
        },
        hasViewport: function(name) {
            return this.getViewports().indexOf(name) >= 0;
        },
        getViewports: function() {
            return _.map(this.get('tests').results, function(result) {
                return result.get('viewport');
            });
        },
        getDiffForViewport: function(viewport) {
            return Math.ceil(this.get('tests').results.find(function(model) {
                return model.get('viewport') === viewport;
            }).get('diff') || 0);
        },
        getResultForViewport: function(viewport) {
            return this.get('tests').results.find(function(model) {
                return model.get('viewport') === viewport;
            });
        },
        getAvailableViewports: function() {
            return this.get('tests').results.map(function(result) {
                return result.get('viewport');
            });
        }
    });
    return SpecModel;
});
