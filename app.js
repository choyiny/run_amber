/**
 * Cho Yin Yong, Youyee Chen 2017
 * Hackathon Project - Something something
 * Version 0.1.1
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

// hider or seeker?
server.seekerConnected = false;

/*
Creates a new player with id on server

id: player's identity in game
role: 0=seeker, 1=hider
 */
function newPlayer(id, x, y) {
    // assign player an ID
    this.id = id;

    // assign hider if seeker connected, seeker otherwise
    if (server.seekerConnected) {
        this.role = 1
    } else {
        this.role = 0
        server.seekerConnected = true
    }
    // coordinates for player to spawn
    this.x = x
    this.y = y
}

// listen to the connection event - fired when player
// connects to server using io.connect()
io.on('connection', function(socket){

    // callback to react to 'newplayer' message
    socket.on('newplayer', function(){

        // create a new player object
        // TEMP: set player location to (100, 100)
        //socket.player = newPlayer(server.lastPlayerID++, 100, 100);
        socket.player = {
            id: server.lastPlayerID++,
            x: 300,
            y: 200
        }

        // get all players in map
        socket.emit('allplayers', getAllPlayers());

        // send position to all players except for the players
        socket.broadcast.emit('newplayer', socket.player);

        // on player click
        socket.on('click', function(data) {
            console.log('click to' + data.x  + ',' + data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move', socket.player);
        });

        // on player disconnect
        socket.on('disconnect', function() {
            console.log('player disconnected')
            io.emit('remove', socket.player.id);

            // if player is seeker
            if (socket.player.role == 0) {
                server.seekerConnected = false;
            }
        });
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