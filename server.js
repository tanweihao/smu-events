var express = require('express'),
    http = require("http"),
    url = require("url"),
    fs = require("fs"),
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
        
        var args = {
            app: app,
            url: url,
            fs: fs,
            db: db,
            rootDir: rootDir
        };
        
        require('./routes/routes')(args);
        server.listen(process.env.PORT || 3000, function() {
            console.log('Express server started on port %s', process.env.PORT);
        });
        
        io.sockets.on('connection', function(socket) {
            socket.emit('news', {
                hello: 'world'
            });
            socket.on('my other event', function(data) {
                console.log(data);
            });
        });
    } else {
        console.log(err);
    }
});