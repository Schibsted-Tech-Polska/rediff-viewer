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
        },

        resetModel: function() {
            this.fetched = false;
        },

        render: function() {
            var environment = store.getCurrentEnvironment();
            this.model = store.getCurrentSpec().getResultForViewport(store.getCurrentViewport());
            this.$el.removeClass('ready');
            this.$el.html(_.template(viewTemplate));

            if(this.fetched) {
                this.renderImages(environment);
                this.trigger('ready');
                this.$el.addClass('ready');
            } else {
                var screenshots = this.model.get('screenshots');
                var images = _.keys(screenshots).map(function(name) {
                    return utils.getImageUrl(screenshots[name]);
                });

                loader.fetch(images)
                    .done(function() {
                        this.fetched = true;
                        this.renderImages(environment);
                        this.trigger('ready');
                        this.$el.addClass('ready');
                    }.bind(this))
                    .progress(function(progress) {
                        this.$('.progress .determinate').width(progress + '%')
                    }.bind(this));
            }
        },
        renderImages: function() {
            var html = '';
            var environment = store.getCurrentEnvironment();
            _.each(this.model.get('screenshots'), function(screenshot, index) {
                html += '<img class="card" data-environment="' + index + '" src="' + utils.getImageUrl(screenshot) + '"/>';
            }.bind(this));

            this.$('.images').html(html);
            this.$images = this.$('.images img');

            if(environment) {
                this.$images.filter('[data-environment="' + environment + '"]').addClass('active');
            } else {
                this.$images.first().addClass('active');
            }
        },
        onEnvironmentChange: function() {
            this.$images
                .removeClass('active')
                .filter('[data-environment="' + store.getCurrentEnvironment() + '"]')
                .addClass('active');
        }
    });
    return ResultView;
});
