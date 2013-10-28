module.exports = function (args) {
    var app = args.app,
        db = args.db;
    app.post('/api/events/register', function (req, res) {
        var eventCollection = db.collection('events');
        
        eventCollection.findAndModify({
            "id": parseInt(req.body.event_id),
            "signups.id": parseInt(req.body.user_id)
        }, [], {
            $set: {
                "signups.$.registered": true
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