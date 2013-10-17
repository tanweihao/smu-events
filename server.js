var path = require('path'),
    express = require('express'),
    url = require("url"),
    rootDir = __dirname;

var app = express();
app.use(express.static(path.resolve(__dirname, 'client')));

// Epxress app configurations
app.configure(function () {
    app.use(app.router);
    app.use(express.static(__dirname + '/client'));
});

var args = {
    app: app,
    url: url,
    rootDir: rootDir
};

require('./routes/routes')(args);

app.listen(process.env.PORT || 3000);
console.log('Express server started on port %s', process.env.PORT);