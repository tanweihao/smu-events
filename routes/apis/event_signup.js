module.exports = function (args) {
    var app = args.app,
        db = args.db,
        io = args.io,
        request = args.request;;
    app.post('/api/events/signup', function (req, res) {
        var eventCollection = db.collection('events'),
            uid = parseInt(req.body.uid);
        
        eventCollection.findAndModify({
            id: parseInt(req.body.event_id)
        }, [], {
            $addToSet: {
                signups: {
                    id: uid,
                    email: req.body.email,
                    registered: false
                }
            }
        }, {
            new: true
        }, function(err, event) {
            if (!err && event != null) {
                request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/broadcast/ping_others', {
                    form: {
                        to: "{'to':[{'id':"+uid+"}]",
                        loc: "{'loc':[{'type':10}",
                        content: '{"type":1, "event_name":"'+event.event_name+'"}',
                        appid: "176110"
                    },
                    jar: true
                }, function(error, res, data) {
                    console.log(data);
                });
                io.sockets.emit('signup_notify', {
                    hello: 'world'
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