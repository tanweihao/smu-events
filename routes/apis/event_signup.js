module.exports = function (args) {
    var app = args.app,
        mongodb = args.mongodb,
        moment = args.moment,
        db = args.db;
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
                if (args.sockets[event.org_id]) {
                    console.log("Sending signup notification to " + event.org_id);
                    args.sockets[event.org_id].emit("signup_notify", {
                        user_name: req.body.name,
                        event_name: event.event_name
                    });
                }
                
                var timeNow = moment().zone("+0800"),
                    nowDateStr = timeNow.format("DDMMYYYYHH");
                if (event.code == nowDateStr) {
                    args.eventList[nowDateStr].forEach(function(eventNow) {
                        if (eventNow.id == event._id.toString()) {
                            eventNow.signups.push({
                                uid: uid,
                                name: req.body.name,
                                email: req.body.email,
                                emailHash: req.body.emailHash,
                                registered: false
                            });
                        }
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