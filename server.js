var http = require('http');
var express = require('express');
var Bot = require('./startup/bot');
var Jinaga = require('jinaga');
var JinagaConnector = require('jinaga/connector');

var app = express();
var server = http.createServer(app);
app.server = server;

// Set up the public site
app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.use("/public", express.static(__dirname + "/public"));
app.get('/', function(req, res, next) {
    res.sendFile(__dirname + "/public/index.html");
});
app.get("/config.js", function(req, res, next) {
    res.send(
        "var distributorUrl = \"ws://" + req.headers.host + "/\";\n");
    res.end();
});

var distributor = require('./startup/distributor')(server);

server.listen(process.env.PORT || 8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('DevOpsAgainstHumanity listening at http://%s:%s', host, port);
});

var j = new Jinaga();
j.sync(new JinagaConnector(distributor));
new Bot(j).start();