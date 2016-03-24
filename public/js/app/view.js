'use strict';
define([], function() {
    var View = Backbone.View.extend({
        // holder for each nested view
        subViews: {},
        isDestroyed: false,
        constructor: function() {
            // Call the original constructor
            Backbone.View.apply(this, arguments);
        },

        addSubView: function(key, view) {
            if (this.subViews[key]) {
                this.removeSubView(key);
            }
            this.subViews[key] = view;
            return view;
        },
        getSubView: function(key) {
            return this.subViews[key];
        },

        removeSubView: function(key) {
            var view = this.subViews[key];

            if (view.destroy instanceof Function) {
                view.destroy();
            }

            delete this.subViews[key];
            return view;
        },
        removeAllSubViews: function() {
            // destroy all child sub views
            return _.map(_.keys(this.subViews), this.removeSubView.bind(this));
        },
        destroy: function() {
            // prevent infinity loops
            if (this.isDestroyed) {
                return;
            }
            if (this.onDestroy instanceof Function) {
                this.onDestroy();
            }

            this.removeAllSubViews();

            this.isDestroyed = true;

            this.stopListening();

            // remove all bind events
            this.undelegateEvents();

            return this;
        }
    });
    return View;
});
