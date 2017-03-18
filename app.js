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

/*
 define the locations of things on the map
 type 0: teleporter
 type 1: ???
*/
server.things = [{id: 0, x: 100, y: 100, destX:200, destY:300, type:0},
                 {id: 1, x:500, y:50, destX:400, destY:500, type:0}]
;

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

        // send position to all players except for the players
        socket.broadcast.emit('newplayer', socket.player);

        // load teleporters and things
        socket.emit('loadthings', server.things)

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
        socket.on('wantToTeleport', function(data) {
            // TOOO: make it work

            //io.emit('teleportPlayer', data.id)
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


function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}