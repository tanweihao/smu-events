module.exports = function(args) {
    var moment = args.moment,
        request = args.request,
        mongodb = args.mongodb,
        db = args.db;
    
    var eventCollection = db.collection('events'),
        BSON = mongodb.BSONPure,
        timeNow = moment().zone("+0800"),
        eventDateStr = timeNow.format("DDMMYYYYHH"),
        classDateStr = timeNow.format("dddHH");
    
    //Looping through the event list
    setInterval(function() {
        args.eventList[eventDateStr].forEach(function(event) {
            var currentTime = moment().zone("+0800"),
                eventTime = moment(event.start_date).zone("+0800").subtract("hours",8);
            
            if (eventTime.isBefore(currentTime)) {
                console.log("Event '" +event.name+ "' has started. Location code: " +event.loc_code);
                event.signups.forEach(function(user) {
                    if (!user.registered) {
                        regUser(user, event.loc_code, event);
                    }
                });
            }
        });
    }, 5000);
    
    //Looping through the class list
    setInterval(function() {
        args.classList[classDateStr].forEach(function(cls) {
            var currentTime = moment().zone("+0800"),
                classTime = moment(cls.start_date).zone("+0800").subtract("hours",8);
            
            if (classTime.isBefore(currentTime)) {
                console.log("Class '" +cls.name+ "' has started");
                cls.students.forEach(function(student) {
                    if (!student.registered) {
                        regStudent(student, cls.loc_code, student.name);
                    }
                });
            }
        });
    }, 10000);
    
    function regUser(user, location, eventNow) {
        request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/user_location/userlocation', {
            form: {
                email: user.emailHash,
                appid: "176110"
            },
            jar: true
        }, function(error, res, data) {
            data = JSON.parse(data);
            console.log("Participant location for " +user.name+ ": " + data.section)
            if (data.section === location) {
                eventCollection.findAndModify({
                    _id: eventNow.id,
                    "signups.uid": parseInt(user.uid)
                }, [], {
                    $set: {
                        "signups.$.registered": true
                    }
                }, {
                    new: true
                }, function(err, event) {
                    if (!err && event != null) {
                        console.log("User '" +user.name+ "' has been registered for '" +eventNow.name+ "'");
                        request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/broadcast/ping_others', {
                            form: {
                                to: "{'to':[{'id':"+user.uid+"}]}",
                                loc: "{'loc':[{'type':10}]}",
                                expiry: 336,
                                content: '{"type":1, "event_name":"'+eventNow.name+'"}',
                                appid: "176110"
                            },
                            jar: true
                        }, function(error, res, data) {
                            console.log("Event registered notification sent: " + data);
                        });
                    }
                });
            }
        });
    }
    
    function regStudent(student, location, className) {
        request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/user_location/userlocation', {
            form: {
                email: student.emailHash,
                appid: "176110"
            },
            jar: true
        }, function(error, res, data) {
            data = JSON.parse(data);
            console.log("Student location for " +student.name+ ": " + data.section)
            if (data.section === location) {
                console.log("Match!");
                request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/broadcast/ping_others', {
                    form: {
                        to: "{'to':[{'id':"+student.uid+"}]}",
                        loc: "{'loc':[{'type':10}]}",
                        expiry: 336,
                        content: '{"type":4, "class_name":"'+className+'"}',
                        appid: "176110"
                    },
                    jar: true
                }, function(error, res, data) {
                    console.log("Class attendance notification sent: " + data);
                });
            }
        });
    }
}

