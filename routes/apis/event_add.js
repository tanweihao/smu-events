module.exports = function(args) {
    var app = args.app,
        mongodb = args.mongodb,
        moment = args.moment,
        db = args.db;
    app.post('/api/events/add_event', function(req, res) {
        var userCollection = db.collection('users'),
            eventCollection = db.collection('events'),
            BSON = mongodb.BSONPure;
        
        userCollection.findOne({
            _id: BSON.ObjectID(req.body.org_id)
        }, function(err, user) {
            if (!err) {
                var timeNow = moment(req.body.start_date),
                    dateStr = timeNow.format("DDMMYYYYHH");
                
                eventCollection.insert({
                    event_name: req.body.event_name,
                    org_name: user.username,
                    org_id: req.body.org_id,
                    start_date: new Date(req.body.start_date),
                    end_date: new Date(req.body.end_date),
                    venue: req.body.venue,
                    description: req.body.description,
                    loc_code: parseInt(req.body.loc_code),
                    code: dateStr,
                    signups: [{
                        uid: 10031355,
                        email: "859ceecbc1131cd1a3256905113ac6ffb8abbb6c",
                        registered: false
                    }, {
                        uid: 10059946,
                        email: "69781f0ba56486e50652217ee26473a1c5e62752",
                        registered: false
                    // }, {
                    //     id: 90081053,
                    //     email: "a6@smu.edu.sg",
                    //     registered: false
                    }]
                }, function(err, events) {
                    if (!err) {
                        res.json({
                            id: events[0]._id
                        });
                    }
                })
            }
        });
    });
}