define([
    'app/view',
    'text!templates/error.html'
], function(View, viewTemplate) {
    var ErrorView = View.extend({
        events: {},
        render: function() {
            this.$el.html(_.template(viewTemplate));
        }
    });
    return ErrorView;
});
