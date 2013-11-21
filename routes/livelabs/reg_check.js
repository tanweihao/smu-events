module.exports = function(args) {
    var moment = args.moment,
        request = args.request,
        mongodb = args.mongodb,
        db = args.db;
    
    var eventCollection = db.collection('events'),
        classCollection = db.collection('classes'),
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
                console.log(currentTime.isoWeek(), classTime.isoWeek())
                cls.students.forEach(function(student) {
                    regStudent(student, cls.loc_code, cls);
                });
            }
        });
    }, 5000);
    
    function regUser(user, location, eventNow) {
        request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/user_location/userlocation', {
            form: {
                email: user.emailHash,
                appid: "176110"
            },
            jar: true
        }, function(error, res, data) {
            try {
                data = JSON.parse(data);
            } catch(e) {
                console.log("JSON parse error!");
            }
            
            console.log("Participant location for " +user.name+ ": " + data.section)
            if (data.section == location) {
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
    
    function regStudent(studentNow, location, classNow) {
        request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/user_location/userlocation', {
            form: {
                email: studentNow.emailHash,
                appid: "176110"
            },
            jar: true
        }, function(error, res, data) {
            try {
                data = JSON.parse(data);
            } catch(e) {
                console.log("JSON parse error!");
            }
            console.log("Student location for " +studentNow.name+ ": " + data.section);
            if (data.section == location) {
                var attendance = "",
                    tempStu = "";
                classCollection.findOne({
                    _id: classNow.id
                }, function(err, cls) {
                    if (!err) {
                        cls.students.forEach(function(student) {
                            if (student.uid == studentNow.uid) {
                                attendance = student.attendance;
                                tempStu = student;
                            }
                        });
                        
                        if (attendance.charAt(5) == 0) {
                            attendance = attendance.replaceAt(5, '1');
                            classCollection.findAndModify({
                                _id: classNow.id,
                                "students.uid": studentNow.uid
                            }, [], {
                                $set: {
                                    "students.$.attendance": attendance
                                }
                            }, {
                                new: true
                            }, function(err, cls) {
                                if (!err && cls != null) {
                                    request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/broadcast/ping_others', {
                                        form: {
                                            to: "{'to':[{'id':"+studentNow.uid+"}]}",
                                            loc: "{'loc':[{'type':10}]}",
                                            expiry: 336,
                                            content: '{"type":4, "class_name":"'+classNow.name+'"}',
                                            appid: "176110"
                                        },
                                        jar: true
                                    }, function(error, res, data) {
                                        console.log("Class attendance notification sent: " + data);
                                    });
                                    if (args.sockets[cls.ta_id]) {
                                        console.log("Sending signup notification to " + cls.ta_id);
                                        args.sockets[cls.ta_id].emit("register_notify", {
                                            student_name: tempStu.name,
                                            class_code: cls.class_code,
                                            class_name: cls.class_name
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}