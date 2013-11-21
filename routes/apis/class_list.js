module.exports = function (args) {
    var app = args.app,
        url = args.url,
        mongodb = args.mongodb,
        db = args.db;
    app.get('/api/classes/class_list', function (req, res) {
        var _get = url.parse(req.url, true).query,
            classCollection = db.collection('classes'),
            BSON = mongodb.BSONPure;

        // Building of the search query
        var query = {};
        (_get.uid) ? (query.students = { $elemMatch: { uid: parseInt(_get.uid) } }) : "";
        (_get.ta_id) ? (query.ta_id = _get.ta_id) : "";
        (_get.class_id) ? (query._id = BSON.ObjectID(_get.class_id)) : "";
        
        classCollection.find(query).toArray(function(err, classes) {
            if (!err) {
                if (_get.uid) {
                    classes.forEach(function(cls) {
                        cls.attendance = searchAttendance(parseInt(_get.uid), cls.students);
                        cls.class_part = searchClassPart(parseInt(_get.uid), cls.students);
                        delete cls.students;
                    });
                }
                if (_get.class_id) {
                    if (!_get.week) {
                        res.json(classes[0]);
                    } else {
                        var students = [];
                        classes[0].students.forEach(function(student) {
                            students.push({
                                uid:student.uid,
                                name: student.name,
                                attendance: student.attendance.charAt(parseInt(_get.week)-1),
                                class_part: student.class_part.charAt(parseInt(_get.week)-1)
                            });
                        });
                        res.json(students);
                    }
                } else {
                    res.json(classes);
                }
            }
        });
    });
}

function searchAttendance(uid, students) {
    var attendance = "";
    students.forEach(function(student) {
        if (student.uid == uid) {
            attendance = student.attendance;
        }
    });
    return attendance;
}

function searchClassPart(uid, students) {
    var class_part = "";
    students.forEach(function(student) {
        if (student.uid == uid) {
            class_part = student.class_part;
        }
    });
    return class_part;
}