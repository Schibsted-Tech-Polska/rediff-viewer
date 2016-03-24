'use strict';
define([
    'app/view',
    'app/store',
    'app/loader'
], function(View, store, loader) {

    function getImageUrl(url) {
        return url ? 'results/' + url : undefined;
    }

    var $images = $([]);

    var ResultView = View.extend({
        events: {},
        initialize: function() {
            $images = this.$('.images img');
            this.listenTo(store, 'load:report', this.initializeEnvironments.bind(this));
            this.listenTo(store, 'change:environment', this.render.bind(this));
            this.listenTo(store, 'change:viewport', this.render.bind(this));
            this.listenTo(store, 'change:spec', this.render.bind(this));
            this.initializeEnvironments();
        },

        render: function() {
            var spec = store.getCurrentSpec();
            $images.removeClass('active');
            if (spec) {
                var result = spec.getResultForViewport(store.getCurrentViewport());
                if (result) {
                    this.$el.removeClass('ready');
                    var screenshots = result.get('screenshots');
                    var images = _.keys(screenshots).map(function(name) {
                        return getImageUrl(screenshots[name]);
                    }).filter(function(url) {
                        return !!url;
                    });

                    loader.fetch(images)
                        .done(function() {
                            this.renderImages();
                            this.trigger('ready');
                            this.$el.addClass('ready');
                        }.bind(this))
                        .progress(function(progress) {
                            this.$('.progress .determinate').width(progress + '%')
                        }.bind(this));
                }
            }
        },
        renderImages: function() {
            var spec = store.getCurrentSpec();
            $images.removeClass('active');
            if (spec) {
                var result = spec.getResultForViewport(store.getCurrentViewport());
                if (result) {
                    var environment = store.getCurrentEnvironment();
                    $images.each(function(idx, elm) {
                        var $elm = $(elm);
                        var env = $elm.attr('data-environment');
                        if (env === environment) {
                            $elm.addClass('active');
                        }
                        $elm.attr('src', getImageUrl(result.get('screenshots')[env]));
                    });
                }
            }
        },

        initializeEnvironments: function() {
            if (store.hasReport()) {
                var environments = _.keys(store.getEnvironments());
                var images = this.$('.images img.card');

                environments.forEach(function (env, idx) {
                    $(images[idx]).attr('data-environment', env);
                });
            }
        }
    });
    return ResultView;
});
