module.exports = function(args) {
    var app = args.app,
        moment = args.moment,
        db = args.db;
    app.post('/api/classes/add_class', function(req, res) {
        var classCollection = db.collection('classes'),
            timeNow = moment(req.body.start_date),
            dateStr = timeNow.format("dddHH");
        
        classCollection.insert({
            class_name: req.body.class_name,
            ta_id: req.body.ta_id,
            class_code: req.body.class_code,
            class_start: new Date(req.body.class_start),
            class_end: new Date(req.body.class_end),
            location: req.body.location,
            loc_code: parseInt(req.body.loc_code),
            code: dateStr,
            students: []
        }, function(err, event) {
            if (!err) {
                res.json({
                    status: "success"
                });
            }
        });
    });
}