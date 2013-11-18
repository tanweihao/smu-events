module.exports = function (args) {
    var app = args.app,
        moment = args.moment,
        mongodb = args.mongodb,
        db = args.db,
        io = args.io,
        request = args.request;
        
    app.post('/api/item/comment', function (req, res) {
        var itemCollection = db.collection('items'),
            BSON = mongodb.BSONPure,
            timeNow = moment().zone("+0800");
        
        itemCollection.findAndModify({
            _id: BSON.ObjectID(req.body._id)
        }, [], {
            $push: {
                comments: {
                    uid: parseInt(req.body.uid),
                    email: req.body.email,
                    text: req.body.text,
                    time: new Date(timeNow.format("YYYY-MM-DDTHH:mm"))
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