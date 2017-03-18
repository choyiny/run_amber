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

// listen to the connection event - fired when player
// connects to server using io.connect()
io.on('connection', function(socket){

    // callback to react to 'newplayer' message
    socket.on('newplayer', function(){
        if (!server.seekerConnected) {
            playerRole = 1
            server.seekerConnected = true;
            console.log("seeker connected")
        } else {
            playerRole = 0
            console.log("hider connected")
        }

        // create a new player object
        // role: 1- seeker, 0- hider
        socket.player = {
            id: server.lastPlayerID++,
            x: 300,
            y: 200,
            role: playerRole
        }

        // get all players in map
        socket.emit('allplayers', getAllPlayers());

        // send position to all players except for the players
        socket.broadcast.emit('newplayer', socket.player);

        // listens to player clicks
        socket.on('click', function(data) {
            console.log('click to' + data.x  + ',' + data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move', socket.player);
        });


        socket.on('keypress', function(data) {
            socket.player.key = data.key
            io.emit('movekey', socket.player)
        })

        // on player disconnect
        socket.on('disconnect', function() {
            io.emit('remove', socket.player.id);

            // if player is seeker
            if (socket.player.role == 1) {
                console.log("seeker disconnected")
                server.seekerConnected = false;
            } else {
                console.log("hider disconnected")
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