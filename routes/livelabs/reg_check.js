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
                classTime = moment(cls.class_start).zone("+0800").subtract("hours", 8),
                week = currentTime.isoWeek() - classTime.isoWeek();
            classTime.add("weeks", week);
            
            if (classTime.isBefore(currentTime)) {
                console.log("Class '" +cls.name+ "' has started");
                
                cls.students.forEach(function(student) {
                    regStudent(student, cls.loc_code, cls, week);
                });
            }
        });
    }, 5000);
    
    function regUser(user, location, eventNow) {
        //First check the user's location (this function is only called if user not registered)
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
            
            console.log("Participant location for " +user.name+ ": " + data.section);
            //Check if user is at the event location
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
                        //Send LiveLabs notification
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
    
    function regStudent(studentNow, location, classNow, week) {
        //First get the attendance of the student
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
                
                //Check location if student's attendance is not marked yet
                if (attendance.charAt(week) == 0) {
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
                        console.log("Checking " +studentNow.name+ "'s location: " + data.section);
                        //Mark the attendance if student is at the class location
                        if (data.section == location) {
                            attendance = attendance.replaceAt(week, '1');
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
                                    //Send LiveLabs notification
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
                                        console.log(studentNow.name+ "'s attendance notification sent: " + data);
                                    });
                                    //Send webapp notification
                                    if (args.sockets[cls.ta_id]) {
                                        console.log("Sending attendance notification to " + cls.ta_id);
                                        args.sockets[cls.ta_id].emit("register_notify", {
                                            student_name: tempStu.name,
                                            class_code: cls.class_code,
                                            class_name: cls.class_name
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    }
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}