module.exports = function(args) {
    var app = args.app,
        moment = args.moment,
        db = args.db,
        request = args.request;
    app.post('/api/item/add_item', function(req, res) {
        var itemCollection = db.collection('items'),
            timeNow = moment().zone("+0800");
        
        itemCollection.insert({
            uid: parseInt(req.body.uid),
            email: req.body.email,
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            loc_code: parseInt(req.body.loc_code),
            date: timeNow.format("YYYY-MM-DDTHH:mm"),
            status: false,
            comments: []
        }, function(err, item) {
            if (!err) {
                request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/broadcast/ping_others', {
                    form: {
                        loc: "{'loc':[{'type':12, 'id':[{'floor':"+parseInt(req.body.loc_code)+"}]}]}",
                        expiry: 1,
                        content: '{"type":2, "id":"'+item._id+', "name":"'+item.name+', "location":"'+item.location
                                 +', "description":"'+item.description+', "uid":"'+item.uid+'"}',
                        appid: "176110"
                    },
                    jar: true
                }, function(error, res, data) {
                    console.log("Lost item reported notification sent: " + data);
                });
                res.json({
                    status: "success"
                });
            }
            res.json({
                status: "fail"
            });
        })
    });
}