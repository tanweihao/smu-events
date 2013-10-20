var path = require('path'),
    express = require('express'),
    app = express(),
    url = require("url"),
    rootDir = __dirname,
    MongoClient = require('mongodb').MongoClient,
    connection_string = 'mongodb://admin:livelabs@ds049878.mongolab.com:49878/smu-events';

MongoClient.connect(connection_string, function (err, db) {
    if (!err) {
        // Epxress app configurations
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
            db: db,
            rootDir: rootDir
        };
        
        require('./routes/routes')(args);
        
        app.listen(process.env.PORT || 3000);
        console.log('Express server started on port %s', process.env.PORT);
    } else {
        console.log(err);
    }
});