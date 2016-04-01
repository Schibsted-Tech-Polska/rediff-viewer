'use strict';
define([
    'app/store',
    'application',
    'app/view',
    'text!templates/specs-list-item.html',
    'text!templates/radial-progress.html'
], function(store, app, View, itemTemplate, progressGauge) {

    function renderGauge(progress) {
        return _.template(progressGauge, {
            progress: progress || 0,
            content: isNaN(progress) ? '<i class="material-icons">schedule</i>' : (progress + '%'),
            size: 'small',
            color: {
                inner: 'white'
            }
        });
    }

    var selectedSpecSlug = null;
    var collection = [];
    var $dom = {};

    var SidenavView = View.extend({
        initialize: function() {
            this.listenTo(store, 'load:report', this.onReportLoaded.bind(this));
            this.listenTo(store, 'change:spec', this.render);
            this.listenTo(store, 'search', this.render);
        },

        renderCollection: function() {
            var html = '';
            collection.forEach(function(spec) {
                html += _.template(itemTemplate, {
                    model: spec,
                    renderGauge: renderGauge
                })
            });

            this.$el.html(html);
        },

        render: function() {
            var spec = store.getCurrentSpec();
            if (spec) {
                if (selectedSpecSlug && $dom.hasOwnProperty(selectedSpecSlug)) {
                    $dom[selectedSpecSlug].removeClass('active blue');
                }
                selectedSpecSlug = spec.get('slug');
                if ($dom.hasOwnProperty(selectedSpecSlug)) {
                    $dom[selectedSpecSlug].addClass('active blue');
                }
            }

            var searchTerm = store.getSearchTerm();
            collection.forEach(function(spec) {
                var slug = spec.get('slug');
                if (spec.get('name').indexOf(searchTerm) >= 0) {
                    $dom[slug].removeClass('hidden');
                } else {
                    $dom[slug].addClass('hidden');
                }
            });
        },

        onReportLoaded: function(report) {
            if (collection.length === 0) {
                collection = report.specs;
                this.renderCollection();
                collection.forEach(function(spec) {
                    $dom[spec.get('slug')] = this.$('[data-slug=' + spec.get('slug') + ']');
                }.bind(this));
            }
            this.render();
        }
    });
    return SidenavView;
});
