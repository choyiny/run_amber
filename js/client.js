/**
 * Cho Yin Yong, Youyee Chen 2017
 * RUN AMBER - A Game of Hide and Seek (maybe)
 * Made with <3 for RUHacks 2017
 * Version 0.1.1
 *
 * Game Client
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

// send client keypress to server
Client.sendPress = function(key) {
    Client.socket.emit('keypress', {key:key})
}

// send position
Client.sendPosition = function(x, y) {
    Client.socket.emit('positionUpdate', {x:x, y:y})
}

Client.socket.on('movekey', function(data) {
    Game.movePlayerKeyboard(data.id, data.key)
})