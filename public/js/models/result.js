'use strict';
define([], function() {
    var ResultModel = Backbone.Model.extend({
        defaults: {},
        initialize: function(attributes) {},
        parse: function(data) {
            return data;
        }
    });
    return ResultModel;
});
