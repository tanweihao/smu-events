module.exports = function(args) {
    var db = args.db,
        moment = args.moment;
    
    //Populating the event list
    var eventCollection = db.collection('events'),
        timeNow = moment().zone("+0800");
    var dateStr = timeNow.format("DDMMYYYYHH");
    args.eventList[dateStr] = [];
    
    eventCollection.find({
        code: dateStr
    }).toArray(function(err, events) {
        if (!err) {
            events.forEach(function(event) {
                args.eventList[dateStr].push({
                    id: event.id,
                    location: 104020,
                    signups: event.signups
                });
            });
        }
    });
}