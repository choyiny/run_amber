/**
 * Created by choyiny on 17/3/2017.
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
})

// listen to allplayers message
Client.socket.on('allplayers', function(data) {
   for(var i = 0; i < data.length; i++) {
       Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
   }
});