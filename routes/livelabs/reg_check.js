module.exports = function(args) {
    var moment = args.moment,
        request = args.request;
    
    var timeNow = moment().zone("+0800"),
        eventDateStr = timeNow.format("DDMMYYYYHH"),
        classDateStr = timeNow.format("dddHH");
    
    //Looping through the event list
    setInterval(function() {
        args.eventList[eventDateStr].forEach(function(event) {
            event.signups.forEach(function(user) {
                if (!user.registered) {
                    regUser(user, event.loc_code, event.event_name);
                }
            });
        });
    }, 5000);
    
    //Looping through the class list
    setInterval(function() {
        args.classList[classDateStr].forEach(function(cls) {
            cls.students.forEach(function(student) {
                if (!student.registered) {
                    regStudent(student, cls.loc_code, student.name);
                }
            });
        });
    }, 5000);
    
    function regUser(user, location, eventName) {
        request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/user_location/userlocation', {
            form: {
                email: user.emailHash,
                appid: "176110"
            },
            jar: true
        }, function(error, res, data) {
            data = JSON.parse(data);
            console.log("Participant location for " +user.name+ ": " + data)
            if (data.section === location) {
                console.log("Match!");
                request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/broadcast/ping_others', {
                    form: {
                        to: "{'to':[{'id':"+user.uid+"}]}",
                        loc: "{'loc':[{'type':10}]}",
                        expiry: 336,
                        content: '{"type":1, "event_name":"'+eventName+'"}',
                        appid: "176110"
                    },
                    jar: true
                }, function(error, res, data) {
                    console.log("Event registered notification sent: " + data);
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
            console.log("Student location for " +student.name+ ": " + data)
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

