module.exports = function (args) {
    var app = args.app,
        mongodb = args.mongodb,
        url = args.url,
        db = args.db;
    app.get('/api/item/item_list', function (req, res) {
        var _get = url.parse(req.url, true).query,
            itemCollection = db.collection('items'),
            BSON = mongodb.BSONPure;
        
        //Building of the search query
        var query = {
                status: false
            },
            options = {
                limit: 10
            };
        
        //Handling of optional parameters
        (_get.page) ? (options.skip = _get.page * 10) : 0;
        (_get.uid) ? (query.uid = parseInt(_get.uid)) : "";
        (_get.keyword) ? (query.name = { $regex: _get.keyword }) : "";
        (_get.item_id) ? (query._id = BSON.ObjectID(_get.item_id)) : "";
        
        //Ignore status parameter if retrieving by user or item ID
        (_get.uid) ? (delete query.status) : "";
        (_get._id) ? (delete query.status) : "";
        itemCollection.find(query, options).sort({date: -1}).toArray(function(err, items) {
            if (!err) {
                if (_get.item_id) {
                    res.json(items[0]);
                } else {
                    res.json(items);
                }
            }
        });
    });
}