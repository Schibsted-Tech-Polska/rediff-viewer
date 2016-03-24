'use strict';
define([], function() {
    var cache = {};
    var Loader = {
        fetch: function(arr) {
            var deferreds = [];
            var progress = [];
            var response = new $.Deferred();

            function getProgress() {
                return _.reduce(progress, function(total, n) {
                        return total + n;
                    }) / progress.length * 100;
            }

            arr.forEach(function(url, i) {
                var request = cache[url];
                if (!request) {
                    progress[i] = 0;
                    request = cache[url] = $.ajax({
                        url: url,
                        xhr: function() {
                            var xhr = new window.XMLHttpRequest();
                            xhr.addEventListener("progress", function(event) {
                                if(event.lengthComputable) {
                                    progress[i] = event.loaded / event.total;
                                    response.notify(getProgress());
                                }
                            }, false);
                            return xhr;
                        }
                    });
                } else {
                    progress[i] = 100;
                }

                deferreds.push(request);
            });

            $.when.apply($, deferreds).always(function() {
                response.resolve();
            });

            return response;
        }
    };

    return Loader;
});
