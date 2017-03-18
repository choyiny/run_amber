/**
 * Cho Yin Yong, Youyee Chen 2017
 * RUN AMBER - A Game of Hide and Seek (maybe)
 * Made with <3 for RUHacks 2017
 * Version 0.1.1
 *
 * Game Code
 *
 */

var Game = {};

// global constants
var HIDER_SPEED = 2;
var SEEKER_SPEED = 3;
var cursors;


// Initializes the game
Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

// preloads game with tiles and background
Game.preload = function() {

    // load location and image of the tiles
    game.load.tilemap("map", "assets/map/testmap.json");
    //game.load.tilemap('map', 'assets/map/basemap.json');
    //game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
    game.load.spritesheet('terraintiles', 'assets/map/terrain_atlas.png',32,32);
    //game.load.spritesheet('treetiles', 'assets/map/tiles/Objects/Tree0.png',16,16);

    // load player sprite
    game.load.image('sprite','assets/sprites/sprite.png');
};

Game.create = function(){
    Game.playerMap = {};
    Game.teleporterMap = {};
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    //testKey.onDown.add(Client.sendTest, this);
    var map = game.add.tilemap('map');

    //map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    map.addTilesetImage('terrain_atlas', 'terraintiles');
    //map.addTilesetImage('Floor', 'floortiles');
    /*var layer;
    *for(var i = 0; i < map.layers.length; i++) {
    *   layer = map.createLayer(i);
    }*/

    //map.createLayer("Underground");
    //map.createLayer("Ground layer");
    //map.createLayer("Second layer");

    var layer = map.createLayer(0);
    layer.resizeWorld();

    // request objects to be displayed clientside
    Client.askNewPlayer();
    Client.askThings();

    // create cursors to move player
    cursors = {
        w: Game.input.keyboard.addKey(Phaser.Keyboard.W),
        a: Game.input.keyboard.addKey(Phaser.Keyboard.A),
        s: Game.input.keyboard.addKey(Phaser.Keyboard.S),
        d: Game.input.keyboard.addKey(Phaser.Keyboard.D)
    };

    // zoom in the map, so not the whole maze is visible
    Game.world.scale.set(2);
};

// Captures WASD keypresses and send presses to server
Game.update = function(){
    if (cursors.w.isDown) {
        Client.sendPress('w');
    } else if (cursors.a.isDown) {
        Client.sendPress('a');
    } else if (cursors.s.isDown) {
        Client.sendPress('s');
    } else if (cursors.d.isDown) {
        Client.sendPress('d');
    }
};

// adds player to dictionary
Game.addNewPlayer = function(id,x,y){

    // spawn the sprite of player and define player
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
    player = Game.playerMap[id]

    // setup necessary physics to game
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;

    // setup camera to follow player
    Game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

};

// adds teleporters to dictionary
Game.addNewTeleporter = function(id, x, y) {
    // TODO: make teleporters actually work
    //Game.teleporterMap[id] = game.add.sprite(x, y, 'teleporter');
}

// Removes the player from the dictionary
Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

// move according to player key presses
Game.movePlayerKeyboard = function(id, key) {
    // get player
    var player = Game.playerMap[id];

    // move player according to keypress
    if (key == 'w') {
        player.y -= HIDER_SPEED;
    } else if (key == 'a') {
        player.x -= HIDER_SPEED;
    } else if (key == 's') {
        player.y += HIDER_SPEED;
    } else if (key == 'd') {
        player.x += HIDER_SPEED;
    }

    // update position to server
    Client.sendPosition(player.x, player.y)
};

//Teleporting
Game.teleportPlayer = function(id, destX, destY) {

    var player = Game.playerMap[id];

    player.x = destX
    player.y = destY

    // update position to server
    Client.sendPosition(player.x, player.y)
}