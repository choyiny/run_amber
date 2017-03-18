/**
 * Cho Yin Yong, Youyee Chen 2017
 * RUN AMBER - A Game of Hide and Seek (maybe)
 * Made with <3 for RUHacks 2017
 * Version 0.1.1
 *
 * Server:
 * - Listens to keypresses, position updates
 * - Listens to new player connections and disconnections.
 * - Broadcasts all players location
 */

// express and socket imports
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

// resources to load to webserver
app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

// run index
app.get('/',function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// listen on port 8081
server.listen(8081, function(){
    console.log('Server open on port ' + server.address().port);
});


// server variables
server.lastPlayerID = 0;
server.seekerConnected = false;
server.tpIDToCoordinates = {};


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
        };

        // get all players in map
        socket.emit('allplayers', getAllPlayers());
        socket.emit('allobjects', getThings());

        // send position to all players except for the players
        socket.broadcast.emit('newplayer', socket.player);

        // listens to player keypress
        socket.on('keypress', function(data) {
            socket.player.key = data.key
            io.emit('movedkey', socket.player)
        });

        // update position of player on server
        socket.on('positionUpdate', function(data) {
            socket.player.x = data.x;
            socket.player.y = data.y;
        });

        // when player wants to teleport
        // TODO: check if it works
        socket.on('wantToTeleport', function(data, teleporterID) {
            var destX, destY;
            destX = server.tpIDToCoordinates[teleporterID][0]
            destY = server.tpIDToCoordinates[teleporterID][1]
            io.emit('teleportPlayer', destX, destY)
        });


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

    //socket.on('player')
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

/*
returns the player which is a seeker
 */
function getSeeker() {
    // loop through all players
    Object.keys(io.sockets.connected).forEach(function(socketID) {
        var player = io.sockets.connected[socketID].player;

        // if player's role is seeker, return the player
        if ((player) && (player.role == 1)) {
            return player
        }
    });
}

/*
Returns all the objects in the arena: teleporters, doors, etc.
 */
function getThings() {

}


function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}