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
                    regUser(user, event.location);
                }
            });
        });
    }, 5000);
    
    //Looping through the class list
    setInterval(function() {
        args.classList[classDateStr].forEach(function(cls) {
            cls.students.forEach(function(student) {
                if (!student.registered) {
                    
                }
            });
        });
    }, 5000);
    
    function regUser(user, location) {
        request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/user_location/userlocation', {
            form: {
                email: user.email,
                appid: "176110"
            },
            jar: true
        }, function(error, res, data) {
            data = JSON.parse(data);
            console.log(data)
            if (data.location === location) {
                console.log("Match!");
            }
        });
    }
}

