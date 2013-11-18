module.exports = function(args) {
    var app = args.app,
        db = args.db;
    app.post('/api/classes/add_class', function(req, res) {
        var classCollection = db.collection('classes');
        
        classCollection.insert({
            class_name: req.body.class_name,
            class_code: req.body.class_code,
            class_start: req.body.class_start,
            class_end: req.body.class_end,
            location: req.body.location,
            loc_code: parseInt(req.body.loc_code)
        }, function(err, event) {
            if (!err) {
                res.json({
                    status: "success"
                });
            }
        });
    });
}