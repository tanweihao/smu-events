module.exports = function (args) {
    var app = args.app,
        mongodb = args.mongodb,
        url = args.url,
        db = args.db;
    app.get('/api/item/item_list', function (req, res) {
        var _get = url.parse(req.url, true).query,
            itemCollection = db.collection('items'),
            BSON = mongodb.BSONPure;
        
        // Building of the search query
        var query = {},
            options = {
                limit: 10
            };
        
        (_get.page) ? (options.skip = _get.page * 10) : 0;
        (_get.uid) ? (query.uid = parseInt(_get.uid)) : "";
        (_get.keyword) ? (query.name = _get.keyword) : "";
        (_get._id) ? (query._id = BSON.ObjectID(_get._id)) : "";
        itemCollection.find(query, options).toArray(function(err, items) {
            if (!err) {
                res.json(
                    items
                );
            }
        });
    });
}