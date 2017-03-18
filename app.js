/**
 * Cho Yin Yong, Youyee Chen 2017
 * Hackathon Project - Something something
 */

// express and socket imports
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

// run index
app.get('/',function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/',function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// listen on port 8081
server.listen(8081, function(){
    console.log('Listening on ' + server.address().port);
});