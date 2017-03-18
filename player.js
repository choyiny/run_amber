/**
 * Cho Yin Yong, Youyee Chen 2017
 * Player Class
 */

/*
 Creates a new player with id on server

 id: player's identity in game
 role: 0=seeker, 1=hider
 */
var Player = function(x, y) {

    // define the player's location, id, and role
    var x = x,
        y = y,
        id = server.lastPlayerID++;

    var getX = function() {
        return x;
    }

    var getY = function() {
        return y;
    }

    var setX = function(newX) {

    }
}