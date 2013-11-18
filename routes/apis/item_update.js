module.exports = function (args) {
    var app = args.app,
        mongodb = args.mongodb,
        db = args.db,
        io = args.io,
        request = args.request;
    app.post('/api/item/update', function (req, res) {
        var itemCollection = db.collection('items'),
            BSON = mongodb.BSONPure,
            status = true;
        
        (req.body.status == true) ? "" : (status = false);
        itemCollection.findAndModify({
            _id: BSON.ObjectID(req.body._id)
        }, [], {
            status: status
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