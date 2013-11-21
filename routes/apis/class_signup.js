module.exports = function (args) {
    var app = args.app,
        mongodb = args.mongodb,
        moment = args.moment,
        db = args.db;
    app.post('/api/classes/signup', function (req, res) {
        var classCollection = db.collection('classes'),
            BSON = mongodb.BSONPure;
        
        req.body.students.forEach(function(student) {
            student.attendance = "00000000000000",
            student.class_part = "00000000000000"
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
                var timeNow = moment().zone("+0800"),
                    nowDateStr = timeNow.format("dddHH");
                if (cls.code == nowDateStr) {
                    args.classList[nowDateStr].forEach(function(classNow) {
                        if (classNow.id == cls._id.toString()) {
                            classNow.students.push(req.body.students);
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