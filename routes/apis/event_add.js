module.exports = function(args) {
    var app = args.app,
        db = args.db;
    app.post('/api/events/add_event', function(req, res) {
        var userCollection = db.collection('users'),
            eventCollection = db.collection('events');
        
        userCollection.findOne({
            id: req.body.org_id
        }, function(err, user) {
            if (!err) {
                eventCollection.count(function(err, docs) {
                    if (!err) {
                        var id = docs + 1,
                            start_date = new Date(req.body.start_date);
                        start_date.setHours(start_date.getHours()+5);
                        var dateStr = start_date.getDate() +""+ (start_date.getMonth()+1) + start_date.getFullYear() + start_date.getHours();
                        
                        eventCollection.insert({
                            id: id,
                            event_name: req.body.event_name,
                            org_name: user.username,
                            org_id: req.body.org_id,
                            start_date: start_date,
                            end_date: new Date(req.body.end_date),
                            venue: req.body.venue,
                            description: req.body.description,
                            code: dateStr,
                            signups: [{
                                id: 10031355,
                                email: "weihao.tan.2010@sis.smu.edu.sg",
                                registered: false
                            }, {
                                id: 10059946,
                                email: "jwijayanti.2011@sis.smu.edu.sg",
                                registered: false
                            // }, {
                            //     id: 90081053,
                            //     email: "a6@smu.edu.sg",
                            //     registered: false
                            }]
                        }, function(err, event) {
                            if (!err) {
                                res.json({
                                    id: id
                                });
                            }
                        })
                    }
                });
            }
        });
    });
}