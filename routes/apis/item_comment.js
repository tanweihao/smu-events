module.exports = function (args) {
    var app = args.app,
        mongodb = args.mongodb,
        db = args.db,
        io = args.io,
        request = args.request;
    app.post('/api/item/comment', function (req, res) {
        var itemCollection = db.collection('items'),
            BSON = mongodb.BSONPure;
        
        itemCollection.findAndModify({
            _id: BSON.ObjectID(req.body._id)
        }, [], {
            $push: {
                comments: {
                    uid: parseInt(req.body.uid),
                    email: req.body.email,
                    text: req.body.text
                }
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