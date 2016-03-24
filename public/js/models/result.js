'use strict';
define([], function() {
    var ResultModel = Backbone.Model.extend({
        defaults: {},
        initialize: function(attributes) {},
        parse: function(data) {
            return data;
        },
        getDiff: function() {
            return Math.ceil(this.get('diff') || 0);
        }
    });
    return ResultModel;
});
