define([
    'app/view',
    'app/store',
    'text!templates/summary.html'
], function(View, store, viewTemplate) {
    var SummaryView = View.extend({
        events: {},
        initialize: function() {
            this.listenTo(store, 'load:report', this.render.bind(this));
        },
        render: function() {
            this.$el.html(_.template(viewTemplate, {report: store.getReport()}));
        }
    });
    return SummaryView;
});
