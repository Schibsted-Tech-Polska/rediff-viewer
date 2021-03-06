'use strict';
define([
    'app/store'
], function(store) {
    var Router = Backbone.Router.extend({
        routes: {
            "!/error": "error",
            "!/spec/:slug": "spec",
            "!": "summary",
            "!/": "summary",
            "": "summary"
        },

        start: function() {
            Backbone.history.start();
        },

        summary: function() {
            this.trigger('change:view', 'summary');
        },

        spec: function(slug) {
            this.trigger('change:view', 'spec', slug);
            store.setCurrentSpecSlug(slug);
        },

        error: function() {
            this.trigger('change:view', 'error');
        }
    });

    return Router;
});
