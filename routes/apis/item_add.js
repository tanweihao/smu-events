module.exports = function(args) {
    var app = args.app,
        db = args.db,
        request = args.request;
    app.post('/api/item/add_item', function(req, res) {
        var itemCollection = db.collection('items');
        
        itemCollection.insert({
            uid: parseInt(req.body.uid),
            email: req.body.email,
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            loc_code: parseInt(req.body.loc_code),
            status: false,
            comments: []
        }, function(err, item) {
            if (!err) {
                request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/broadcast/ping_others', {
                    form: {
                        loc: "{'loc':[{'type':12, 'id':[{'floor':"+parseInt(req.body.loc_code)+"}]}]}",
                        expiry: 1,
                        content: '{"type":2, "id":"'+item._id+', "name":"'+item.name+', "location":"'+item.location+', "description":"'+item.description+'"}',
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
        })
    });
}