'use strict';
define([
    'app/view',
    'app/store',
    'text!templates/searchbox.html'
], function(View, store, viewTemplate) {
    var $input = null;
    var SearchView = View.extend({
        events: {
            'blur input': 'onChange',
            'keyup input': 'onChange'
        },
        initialize: function() {
            this.render();
            $input = this.$el.find('input');
        },
        render: function() {
            this.$el.html(_.template(viewTemplate));
        },
        onChange: function() {
            setTimeout(function() {
                store.setSearchTerm($input.val());
            });
        }
    });
    return SearchView;
});
