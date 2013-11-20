module.exports = function (args) {
    var app = args.app,
        mongodb = args.mongodb,
        db = args.db,
        moment = args.moment;
    app.post('/api/events/update', function (req, res) {
        var eventCollection = db.collection('events'),
            BSON = mongodb.BSONPure,
            event = {};
        
        (req.body.event_name) ? (event.event_name = req.body.event_name) : "";
        (req.body.venue) ? (event.venue = req.body.venue) : "";
        (req.body.description) ? (event.description = req.body.description) : "";
        (req.body.loc_code) ? (event.loc_code = parseInt(req.body.loc_code)) : "";
        if (req.body.start_date) {
            var timeNow = moment(req.body.start_date),
                dateStr = timeNow.format("DDMMYYYYHH");
            event.start_date = new Date(req.body.start_date);
            event.code = dateStr;
        }
        if (req.body.end_date) {
            var timeNow = moment(req.body.end_date),
                dateStr = timeNow.format("DDMMYYYYHH");
            event.end_date = new Date(req.body.end_date);
            event.code = dateStr;
        }
        
        eventCollection.findAndModify({
            _id: BSON.ObjectID(req.body.event_id)
        }, [], {
            $set: event
        }, {
            new: true
        }, function(err, item) {
            if (!err && item != null) {
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