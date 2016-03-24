'use strict';
define([
    'app/store',
    'application',
    'app/view',
    'text!templates/specs-list-item.html',
    'text!templates/radial-progress.html'
], function(store, app, View, itemTemplate, progressGauge) {
    var View = View.extend({
        events: {},
        initialize: function() {
            this.$links = $([]);
            this.listenTo(store, 'load:report', this.onReportLoaded.bind(this));
            this.listenTo(store, 'change:spec', this.onChangeSpec.bind(this));
            this.listenTo(store, 'search', this.onSearchTermChange.bind(this));
        },

        renderGauge: function(progress) {
            return _.template(progressGauge, {
                progress: progress,
                content: isNaN(progress) ? '<i class="material-icons">schedule</i>' : (progress + '%'),
                size: 'small',
                color: {
                    inner: 'white'
                }
            });
        },

        onReportLoaded: function(report) {
            this.collection = report.specs;
            this.render();
        },

        onChangeSpec: function(spec) {
            if (spec) {
                this.$links.removeClass('active blue');
                this.$links.filter('[data-slug="' + spec.get('slug') + '"]').addClass('active blue');
            }
        },

        render: function() {
            var html = '';

            this.collection.forEach(function(spec) {
                console.log(spec.get('slug'), spec.getAverageDiff());
                html += _.template(itemTemplate, {
                    model: spec,
                    renderGauge: this.renderGauge
                })
            }.bind(this));

            this.$el.html(html);

            this.$links = this.$('a');
            this.onChangeSpec(store.getCurrentSpec());
        },
        onSearchTermChange: function(val) {
            this.$links.each(function(idx, elm) {
                var $elm = $(elm);
                if($elm.find('.label').text().trim().indexOf(val) < 0) {
                    $elm.addClass('hidden');
                } else {
                    $elm.removeClass('hidden')
                }
            });
        }
    });
    return View;
});
