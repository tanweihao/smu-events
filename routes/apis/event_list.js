module.exports = function (args) {
    var app = args.app,
        url = args.url,
        db = args.db;
    app.get('/api/events/event_list', function (req, res) {
        var _get = url.parse(req.url, true).query,
            eventCollection = db.collection('events');

        // Building of the search query
        var query = {},
            options = {
                limit: 10,
                fields: {
                    _id: 0
                }
            };
        
        (_get.page) ? (options.skip = _get.page * 10) : 0;
        (_get.org_id) ? (query.org_id = parseInt(_get.org_id)) : "";
        if (_get.past_events) {
            query.signups = parseInt(_get.past_events);
            query.start_date = {
                $lte: new Date()
            }
        }
        if (_get.future_events) {
            query.signups = parseInt(_get.future_events);
            query.start_date = {
                $gte: new Date()
            }
        }
        
        eventCollection.find(query, options).toArray(function(err, events) {
            if (!err) {
                var user_id = parseInt(_get.user_id);
                events.forEach(function(event) {
                    if (_get.user_id) {
                        (event.signups.indexOf(user_id) == -1) ? (event.status = false) : (event.status = true);
                    }
                    delete event.signups;
                });
                res.json(
                    events
                );
            }
        });
    });
}