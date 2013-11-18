module.exports = function (args) {
    var app = args.app,
        mongodb = args.mongodb,
        db = args.db;
    app.post('/api/events/register', function (req, res) {
        var eventCollection = db.collection('events'),
            BSON = mongodb.BSONPure;
        
        eventCollection.findAndModify({
            _id: BSON.ObjectID(req.body.event_id),
            "signups.id": parseInt(req.body.uid)
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