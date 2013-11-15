var express = require('express'),
    http = require("http"),
    url = require("url"),
    fs = require("fs"),
    request = require('request'),
    crypto = require('crypto'),
    rootDir = __dirname,
    mongodb = require("mongodb"),
    MongoClient = mongodb.MongoClient,
    connection_string = 'mongodb://admin:livelabs@ds049878.mongolab.com:49878/smu-events',
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

MongoClient.connect(connection_string, function (err, db) {
    if (!err) {
        // Express app configurations
        app.configure(function () {
            app.use(express.static(__dirname + '/client'));
            app.use(express.bodyParser({
                keepExtensions: true
            }));
            app.use(app.router);
        });
        
        //Generate Login hashes
        var userSHA = crypto.createHash('sha1'),
            passwordSHA = crypto.createHash('sha1');
        
        userSHA.update("weihao.tan.2010@sis.smu.edu.sg");
        passwordSHA.update("60116364");
        
        var userHash = userSHA.digest('hex'),
            passwordHash = passwordSHA.digest('hex');
        
        var args = {
            app: app,
            url: url,
            http: http,
            request: request,
            crypto: crypto,
            userHash: userHash,
            passwordHash: passwordHash,
            fs: fs,
            db: db,
            io: io,
            rootDir: rootDir,
            eventList: {}
        };
        
        //Populating the event list
        var eventCollection = db.collection('events'),
            date = new Date();
        date.setHours(date.getHours()+13);
        var dateStr = date.getDate() +""+ (date.getMonth()+1) + date.getFullYear() + date.getHours();
        args.eventList[dateStr] = [];
        
        // console.log(dateStr);
        eventCollection.find({
            code: dateStr
        }).toArray(function(err, events) {
            if (!err) {
                events.forEach(function(event) {
                    args.eventList[dateStr].push({
                        id: event.id,
                        signups: event.signups
                    });
                });
            }
        });
        
        //Logging into Livelabs API
        request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/authenticate/login_others', {
            form: {
                username: userHash,
                password: passwordHash,
                appid: "176110"
            },
            jar: true
        }, function(error, res, data) {
            console.log(data);
        });
        
        //Looping through the event list
        setInterval(function() {
            args.eventList[dateStr].forEach(function(event) {
                event.signups.forEach(function(user) {
                    if (!user.registered) {
                        console.log(user.id);
                    }
                })
            });
        }, 5000);
        
        require('./routes/routes')(args);
        server.listen(process.env.PORT || 3000, function() {
            console.log('Express server started on port %s', process.env.PORT);
        });
    } else {
        console.log(err);
    }
});