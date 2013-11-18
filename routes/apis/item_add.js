module.exports = function(args) {
    var app = args.app,
        db = args.db;
    app.post('/api/item/add_item', function(req, res) {
        var itemCollection = db.collection('items');
        
        itemCollection.insert({
            uid: parseInt(req.body.uid),
            email: req.body.email,
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            loc_code: req.body.loc_code,
            status: false,
            comments: []
        }, function(err, item) {
            if (!err) {
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