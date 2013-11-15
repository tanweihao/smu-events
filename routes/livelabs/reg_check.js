module.exports = function(args) {
    var db = args.db,
        crypto = args.crypto,
        request = args.request;
    
    var date = new Date(),
        eventCollection = db.collection('events');
    date.setHours(date.getHours()+13);
    var dateStr = date.getDate() +""+ (date.getMonth()+1) + date.getFullYear() + date.getHours();
    
    //Looping through the event list
    setInterval(function() {
        args.eventList[dateStr].forEach(function(event) {
            event.signups.forEach(function(user) {
                if (!user.registered) {
                    regUser(user, event.location);
                }
            });
        });
    }, 5000);
    
    function regUser(user, location) {
        var userSHA = crypto.createHash('sha1');
        userSHA.update(user.email);
        var userHash = userSHA.digest('hex');
        
        request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/user_location/userlocation', {
            form: {
                email: userHash,
                appid: "176110"
            },
            jar: true
        }, function(error, res, data) {
            data = JSON.parse(data);
            if (data.location === location) {
                console.log("Match!");
            }
        });
    }
}
