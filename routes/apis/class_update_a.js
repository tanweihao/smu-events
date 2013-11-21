module.exports = function (args) {
    var app = args.app,
        mongodb = args.mongodb,
        db = args.db;
    app.post('/api/classes/update_a', function (req, res) {
        var classCollection = db.collection('classes'),
            BSON = mongodb.BSONPure,
            week = parseInt(req.body.week),
            attendance = "",
            tempStu = "";
        
        classCollection.findOne({
            _id: BSON.ObjectID(req.body.class_id)
        }, function(err, cls) {
            if (!err) {
                cls.students.forEach(function(student) {
                    if (student.uid == parseInt(req.body.uid)) {
                        attendance = student.attendance;
                        tempStu = student;
                    }
                });
                
                attendance = attendance.replaceAt(week-1, req.body.attendance);
                classCollection.findAndModify({
                    _id: BSON.ObjectID(req.body.class_id),
                    "students.uid": parseInt(req.body.uid)
                }, [], {
                    $set: {
                        "students.$.attendance": attendance
                    }
                }, {
                    new: true
                }, function(err, cls) {
                    if (!err && cls != null) {
                        if (args.sockets[cls.ta_id]) {
                            
                            console.log("Sending signup notification to " + cls.ta_id);
                            args.sockets[cls.ta_id].emit("register_notify", {
                                student_name: tempStu.name,
                                class_code: cls.class_code,
                                class_name: cls.class_name
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
            }
        });
    });
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}