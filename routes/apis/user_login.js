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
                        id: user._id,
                        role: user.role
                    });
                }
            }
            res.json({
                result: -1
            });
        });
    });
}