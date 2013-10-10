var http = require('http');
var path = require('path');
var express = require('express');

var router = express();
var server = http.createServer(router);
router.use(express.static(path.resolve(__dirname, 'client')));

// Epxress app configurations
router.configure(function () {
    router.use(router.router);
    router.use(express.static(__dirname + '/client'));
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server running at", addr.address + ":" + addr.port);
});
