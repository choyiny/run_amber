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

// Server code

// Keep track of the last id assigned to a new player
server.lastPlayerID = 0;

// Keep track if the seeker is connected
server.seekerConnected = true;

// listen to the connection event - fired when player
// connects to server using io.connect()
io.on('connection', function(socket){

    // callback to react to 'newplayer' message
    socket.on('newplayer', function(){
        // create a new player object
        socket.player = {
            id: server.lastPlayerID++,
            x: randomInt(100, 400),
            y: randomInt(100, 400)
        };
        // send position to all players
        socket.emit('allplayers', getAllPlayers());

        // send position to all players except for the players
        socket.broadcast.emit('newplayer',socket.player);
    });
});

/*
returns array of connected players
 */
function getAllPlayers(){

    // dummy variable to store players
    var players = [];
    // get keys to players connected
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;

        // put player to array
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}