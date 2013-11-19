module.exports = function (args) {
    var app = args.app,
        db = args.db;
    app.post('/api/users/add_organizer', function (req, res) {
        var userCollection = db.collection('users');
        
        userCollection.count(function(err, docs) {
            if (!err) {
                var id = docs + 1;
                
                userCollection.insert({
                    id: id,
                    username: req.body.username,
                    password: req.body.password,
                    role: req.body.role
                }, function(err, user) {
                    if (!err) {
                        res.json({
                            id: id
                        });
                    }
                })
            }
        });
    });
}