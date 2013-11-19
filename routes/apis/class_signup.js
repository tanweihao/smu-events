module.exports = function (args) {
    var app = args.app,
        mongodb = args.mongodb,
        db = args.db;
    app.post('/api/classes/signup', function (req, res) {
        var classCollection = db.collection('classes'),
            BSON = mongodb.BSONPure;
        
        req.body.students.forEach(function(student) {
            student.attendance = "00000000000000"
        });
        
        classCollection.findAndModify({
            _id: BSON.ObjectID(req.body.class_id)
        }, [], {
            $push: {
                students: {
                    $each: req.body.students
                }
            }
        }, {
            new: true
        }, function(err, cls) {
            if (!err && cls != null) {
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