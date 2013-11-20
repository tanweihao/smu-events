var express = require('express'),
    http = require("http"),
    url = require("url"),
    fs = require("fs"),
    request = require('request'),
    moment = require('moment'),
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
            moment: moment,
            crypto: crypto,
            userHash: userHash,
            passwordHash: passwordHash,
            fs: fs,
            mongodb: mongodb,
            db: db,
            io: io,
            rootDir: rootDir,
            eventList: {},
            classList: {}
        };
        
        //Logging into Livelabs API
        request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/authenticate/login_others', {
            form: {
                username: userHash,
                password: passwordHash,
                appid: "176110"
            },
            jar: true
        }, function(error, res, data) {
            console.log("LiveLabs login outcome: " + data);
        });
        
        require('./routes/routes')(args);
        server.listen(process.env.PORT || 3000, function() {
            console.log('Express server started on port %s', process.env.PORT);
        });
    } else {
        console.log(err);
    }
});