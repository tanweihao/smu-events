module.exports = function (args) {
    var app = args.app,
        mongodb = args.mongodb,
        db = args.db,
        io = args.io,
        request = args.request;
    app.post('/api/events/signup', function (req, res) {
        var eventCollection = db.collection('events'),
            uid = parseInt(req.body.uid),
            BSON = mongodb.BSONPure;
        
        eventCollection.findAndModify({
            _id: BSON.ObjectID(req.body.event_id)
        }, [], {
            $addToSet: {
                signups: {
                    uid: uid,
                    name: req.body.name,
                    email: req.body.email,
                    emailHash: req.body.emailHash,
                    registered: false
                }
            }
        }, {
            new: true
        }, function(err, event) {
            if (!err && event != null) {
                io.sockets.emit('signup_notify', {
                    hello: 'world'
                });
                res.json({
                    status: "success"
                });
            }
            res.json({
                status: "fail"
            });
        });
    });
}