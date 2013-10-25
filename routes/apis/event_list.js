module.exports = function (args) {
    var app = args.app,
        url = args.url,
        db = args.db;
    app.get('/api/events/event_list', function (req, res) {
        var _get = url.parse(req.url, true).query,
            eventCollection = db.collection('events');

        // Parameters passed in URL
        var page = (_get.page) ? _get.page * 10 : 0,
            org_id = (_get.org_id) ? parseInt(_get.org_id) : "";
        
        if (org_id == "") {
            eventCollection.find({
                
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
        } else {
            eventCollection.find({
                org_id: org_id
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
        }
    });
}