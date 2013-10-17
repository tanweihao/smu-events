module.exports = function (args) {
    var app = args.app,
        url = args.url;
    app.get('/api/event_list', function (req, res) {
        var _get = url.parse(req.url, true).query;

        // Parameters passed in URL
        // var country = (_get.country) ? _get.country : '';

        res.json({
            events: ["a","b"]
        });
    });
}