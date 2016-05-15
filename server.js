var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app);
app.server = server;

// Set up the public site
app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.use("/public", express.static(__dirname + "/public"));
app.get('/', function(req, res, next) {
    res.sendFile(__dirname + "/public/index.html");
});

require('./startup/distributor')(server);
// Additional startup will go here.

server.listen(process.env.PORT || 8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('ImprovingU listening at http://%s:%s', host, port);
});