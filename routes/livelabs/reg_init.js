module.exports = function(args) {
    var db = args.db;
    
    //Populating the event list
    var eventCollection = db.collection('events'),
        date = new Date();
    date.setHours(date.getHours()+13);
    var dateStr = date.getDate() +""+ (date.getMonth()+1) + date.getFullYear() + date.getHours();
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