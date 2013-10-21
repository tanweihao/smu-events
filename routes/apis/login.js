module.exports = function (args) {
    var app = args.app,
        db = args.db;
    app.post('/api/login', function (req, res) {
        var userCollection = db.collection('users');
        
        userCollection.findOne({
            username: req.body.username
        }, function(err, user) {
            if (!err && user != null) {
                if (user.password == req.body.password) {
                    res.json({
                        result: user.id
                    });
                }
            }
            res.json({
                result: -1
            });
        });
    });
}