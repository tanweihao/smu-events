module.exports = function(args) {
    var db = args.db,
        moment = args.moment;
    
    var eventCollection = db.collection('events'),
        classCollection = db.collection('classes'),
        timeNow = moment().zone("+0800"),
        eventDateStr = timeNow.format("DDMMYYYYHH"),
        classDateStr = timeNow.format("dddHH");
    args.eventList[eventDateStr] = [];
    args.classList[classDateStr] = [];
    
    //Populating the event list
    eventCollection.find({
        code: eventDateStr
    }).toArray(function(err, events) {
        if (!err) {
            events.forEach(function(event) {
                args.eventList[eventDateStr].push({
                    id: event.id,
                    name: event.event_name,
                    start_date: event.start_date,
                    location: 104020,
                    signups: event.signups
                });
            });
        }
    });
    
    //Populating the class list
    classCollection.find({
        code: classDateStr
    }).toArray(function(err, classes) {
        if (!err) {
            classes.forEach(function(cls) {
                args.classList[classDateStr].push({
                    id: cls.id,
                    name: cls.class_name,
                    start_date: cls.start_date,
                    location: cls.loc_code,
                    students: cls.students
                });
            });
        }
    });
}