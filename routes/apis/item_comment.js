module.exports = function (args) {
    var app = args.app,
        moment = args.moment,
        mongodb = args.mongodb,
        db = args.db,
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
                    time: new Date(timeNow.format("YYYY-MM-DDTHH:mm:ss"))
                }
            }
        }, {
            new: true
        }, function(err, item) {
            if (!err && item != null) {
                request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/broadcast/ping_others', {
                    form: {
                        to: "{'to':[{'id':"+item.uid+"}]}",
                        loc: "{'loc':[{'type':10}]}",
                        expiry: 336,
                        content: '{"type":3, "id":"'+item._id+'", "name":"'+item.name+'", "location":"'+item.location
                                 +'", "description":"'+item.description+'"}',
                        appid: "176110"
                    },
                    jar: true
                }, function(error, res, data) {
                    console.log(data);
                });
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