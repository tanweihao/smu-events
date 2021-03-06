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
                limit: 10
            },
            sortOption = {
                start_date: 1
            };
        
        (_get.page) ? (options.skip = _get.page * 10) : 0;
        (_get.keyword) ? (query.event_name = { $regex: _get.keyword }) : "";
        (_get.org_id) ? (query.org_id = _get.org_id) : "";
        if (_get.past_events) {
            query.signups = {
                $elemMatch: {
                    uid: parseInt(_get.past_events)
                }
            };
            query.start_date = {
                $lte: new Date()
            };
            sortOption.start_date = -1;
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
        
        eventCollection.find(query, options).sort(sortOption).toArray(function(err, events) {
            if (!err) {
                //Run through events list and include attendance if UID is specified
                var uid;
                (_get.uid) ? (uid = parseInt(_get.uid)) : "";
                (_get.past_events) ? (uid = parseInt(_get.past_events)) : "";
                (_get.future_events) ? (uid = parseInt(_get.future_events)) : "";
                events.forEach(function(event) {
                    if (_get.uid || _get.past_events || _get.future_events) {
                        searchUid(event, uid);
                    }
                    event.signupCount = event.signups.length;
                    if (!_get.org_id) {
                        delete event.signups;
                    }
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
            event.signed_up = true;
            event.registered = event.signups[i].registered
            return;
        }
    }
    event.signed_up = false;
}