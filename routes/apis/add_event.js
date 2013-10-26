module.exports = function (args) {
    var app = args.app,
        db = args.db;
    app.post('/api/events/add_event', function (req, res) {
        var eventCollection = db.collection('events');
        
        eventCollection.count(function(err, docs) {
            if (!err) {
                var id = docs + 1;
                
                eventCollection.insert({
                    id: id,
                    event_name: req.body.event_name,
                    org_name: req.body.org_name,
                    org_id: req.body.org_id,
                    start_date: new Date(req.body.start_date),
                    end_date: new Date(req.body.end_date),
                    venue: req.body.venue,
                    description: req.body.description,
                    signups: [1,2]
                }, function(err, event) {
                    if (!err) {
                        res.json({
                            id: id
                        });
                    }
                })
            }
        });
    });
}