module.exports = function (args) {
    var app = args.app,
        db = args.db;
    app.post('/api/events/signup', function (req, res) {
        var eventCollection = db.collection('events');
        
        eventCollection.findAndModify({
            id: parseInt(req.body.event_id)
        }, [], {
            $addToSet: {
                signups: {
                    id: parseInt(req.body.user_id),
                    registered: false
                }
            }
        }, {
            new: true
        }, function(err, event) {
            if (!err && event != null) {
                res.json({
                    result: true
                });
            }
            res.json({
                result: false
            });
        });
    });
}