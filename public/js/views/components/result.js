'use strict';
define([
    'app/view',
    'app/store',
    'app/loader',
    'utils',
    'text!templates/result.html'
], function(View, store, loader, utils, viewTemplate) {
    var ResultView = View.extend({
        events: {},
        initialize: function() {
            this.fetched = false;
            this.listenTo(store, 'change:environment', this.onChange.bind(this));
            this.listenTo(store, 'change:viewport', this.onChange.bind(this));
            this.listenTo(store, 'change:spec', this.onChange.bind(this));
        },

        render: function() {
            this.$el.removeClass('ready');
            this.$el.html(_.template(viewTemplate));

            var spec = store.getCurrentSpec();
            if (spec) {
                var result = spec.getResultForViewport(store.getCurrentViewport());
                if (result) {
                    var environment = store.getCurrentEnvironment();
                    if(this.fetched) {
                        this.renderImages(environment);
                        this.trigger('ready');
                        this.$el.addClass('ready');
                    } else {
                        var screenshots = result.get('screenshots');
                        var images = _.keys(screenshots).map(function(name) {
                            return utils.getImageUrl(screenshots[name]);
                        });

                        loader.fetch(images)
                            .done(function() {
                                this.fetched = true;
                                this.renderImages();
                                this.trigger('ready');
                                this.$el.addClass('ready');
                            }.bind(this))
                            .progress(function(progress) {
                                this.$('.progress .determinate').width(progress + '%')
                            }.bind(this));
                    }
                }
            }
        },
        renderImages: function() {
            var spec = store.getCurrentSpec();
            if (spec) {
                var result = spec.getResultForViewport(store.getCurrentViewport());
                var html = '';

                if (result) {
                    var environment = store.getCurrentEnvironment();
                    _.each(result.get('screenshots'), function (screenshot, env) {
                        var activeClass = env === environment ? ' active' : '';
                        html += '<img class="card' + activeClass + '" data-environment="' + env + '" src="' + utils.getImageUrl(screenshot) + '"/>';
                    }.bind(this));
                }

                this.$('.images').html(html);
            }
        },

        onChange: function() {
            this.fetched = false;
            this.render();
        }
    });
    return ResultView;
});
