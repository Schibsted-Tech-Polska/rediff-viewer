define([
    'jquery',
    'backbone',
    'lodash',
    'application',
    'text!templates/run.html'
], function($, Backbone, _, Application, viewTemplate) {
    var View = Backbone.View.extend({
        events: {},
        render: function() {
            if(!Application.run) {
                return Application.router.navigate('!', {
                    trigger: true,
                    replace: true
                });
            }
            this.$el.html(_.template(viewTemplate, {model: Application.run}));
        }
    });
    return View;
});
