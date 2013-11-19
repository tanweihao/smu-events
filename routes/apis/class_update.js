module.exports = function (args) {
    var app = args.app,
        mongodb = args.mongodb,
        db = args.db;
    app.post('/api/classes/update', function (req, res) {
        var classCollection = db.collection('classes'),
            BSON = mongodb.BSONPure;
        
        classCollection.findAndModify({
            _id: BSON.ObjectID(req.body.class_id),
            "students.uid": parseInt(req.body.uid)
        }, [], {
            $set: {
                "students.$.registered": true
            }
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