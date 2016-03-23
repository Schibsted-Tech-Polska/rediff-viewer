define([], function() {
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
                progress[i] = 0;

                var request = $.ajax({
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
