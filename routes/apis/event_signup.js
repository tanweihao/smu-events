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
                console.log(event.org_id);
                if (args.sockets[event.org_id]) {
                    console.log("Sending signup notification to " + event.org_id);
                    args.sockets[event.org_id].emit("signup_notify", {
                        user_name: req.body.name,
                        event_name: event.event_name
                    });
                }
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