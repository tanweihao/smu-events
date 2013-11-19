module.exports = function (args) {
    var app = args.app,
        db = args.db;
    app.post('/api/users/add_user', function (req, res) {
        var userCollection = db.collection('users');
        
        userCollection.insert({
            username: req.body.username,
            password: req.body.password,
            role: req.body.role
        }, function(err, user) {
            if (!err) {
                res.json({
                    id: user[0]._id
                });
            }
        });
    });
}