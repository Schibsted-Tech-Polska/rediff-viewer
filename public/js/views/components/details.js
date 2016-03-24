'use strict';
define([
    'app/view',
    'app/store',
    'text!templates/spec/details.html'
], function(View, store, viewTemplate) {
    var DetailsView = View.extend({
        initialize: function() {
            this.listenTo(store, 'change:spec', this.render.bind(this));
            this.render();
        },
        render: function(spec) {
            spec = spec || store.getCurrentSpec();
            if (spec) {
                this.$el.html(_.template(viewTemplate, {
                    model: spec,
                    environments: _.omit(store.getEnvironments(), 'diff')
                }));
            }
        }
    });
    return DetailsView;
});
