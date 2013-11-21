module.exports = function (args) {
    var app = args.app,
        mongodb = args.mongodb,
        db = args.db;
    app.post('/api/classes/update_c', function (req, res) {
        var classCollection = db.collection('classes'),
            BSON = mongodb.BSONPure,
            week = parseInt(req.body.week),
            class_part = "";
        
        classCollection.findOne({
            _id: BSON.ObjectID(req.body.class_id)
        }, function(err, cls) {
            if (!err) {
                cls.students.forEach(function(student) {
                    if (student.uid == parseInt(req.body.uid)) {
                        class_part = student.class_part;
                    }
                });
                class_part = class_part.replaceAt(week-1, req.body.class_part);
                classCollection.findAndModify({
                    _id: BSON.ObjectID(req.body.class_id),
                    "students.uid": parseInt(req.body.uid)
                }, [], {
                    $set: {
                        "students.$.class_part": class_part
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
            }
        });
    });
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}