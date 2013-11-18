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
            query.signups = {
                $elemMatch: {
                    uid: parseInt(_get.past_events)
                }
            };
            query.start_date = {
                $lte: new Date()
            };
        }
        if (_get.future_events) {
            query.signups = {
                $elemMatch: {
                    uid: parseInt(_get.future_events)
                }
            };
            query.start_date = {
                $gte: new Date()
            };
        }
        
        eventCollection.find(query, options).toArray(function(err, events) {
            if (!err) {
                //Run through events list and include attendance if UID is specified
                var uid = parseInt(_get.uid);
                events.forEach(function(event) {
                    if (_get.uid) {
                        searchUid(event, uid);
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

function searchUid(event, uid) {
    for (var i = 0; i < event.signups.length; i++) {
        if (event.signups[i].uid === uid) {
            event.status = true;
            return;
        }
    }
    event.status = false;
}