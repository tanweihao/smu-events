module.exports = function (args) {
    var app = args.app,
        url = args.url,
        db = args.db;
    app.get('/api/events/event_list', function (req, res) {
        var _get = url.parse(req.url, true).query,
            eventCollection = db.collection('events');

        // Parameters passed in URL
        var page = (_get.page) ? _get.page * 10 : 0;
        
        eventCollection.find({
            start_date: {
                $gte: new Date()
            }
        }, {
            limit: 10,
            skip: page
        }).toArray(function(err, events) {
            if (!err) {
                res.json(
                    events
                );
            }
        });
    });
}