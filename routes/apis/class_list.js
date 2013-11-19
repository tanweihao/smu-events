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
                        cls.attendance = searchClass(parseInt(_get.uid), cls.students);
                        delete cls.students;
                    });
                }
                if (_get.class_id) {
                    res.json(classes[0]);
                } else {
                    res.json(classes);
                }
            }
        });
    });
}

function searchClass(uid, students) {
    students.forEach(function(student) {
        if (student.uid == uid) {
            return student.attendance;
        }
    });
}