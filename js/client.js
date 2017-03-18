/**
 * Cho Yin Yong, Youyee Chen 2017
 * RUHacks Hackathon Project
 *
 * Game Client
 * - askNewPlayer (emits newplayer)
 * -
 *
 */

var Client = {};

// connects to the server
Client.socket = io.connect();

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

// listen to newplayer message
Client.socket.on('newplayer', function(data) {
    // add new player to the map
    Game.addNewPlayer(data.id, data.x, data.y);
});

// listen to allplayers message
Client.socket.on('allplayers', function(data) {
   for(var i = 0; i < data.length; i++) {
       Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
   }
});

//remove player
Client.socket.on('remove', function(id) {
    Game.removePlayer(id);
});

// moving the player
Client.socket.on('moveplayer', function(id) {

});
