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
    game.load.tilemap("map", "assets/map/testmap.json", null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('terraintiles', 'assets/map/terrain_atlas.png',32,32);

    // load player sprite
    game.load.image('sprite','assets/sprites/sprite.png');
    game.load.image('teleporter', 'assets/sprites/teleporter.png');
};

Game.create = function(){

    // start physics system for collision
    Game.physics.startSystem(Phaser.Physics.ARCADE);

    Game.playerMap = {};
    Game.teleporterMap = {};
    var map = game.add.tilemap('map');

    map.addTilesetImage('terrain_atlas', 'terraintiles');

    // create map layers
    this.groundLayer = map.createLayer(0);
    this.collisionLayer = map.createLayer(1);

    // allow sprite to collide with tiles in the collision layer
    //game.physics.arcade.collide(sprite, collision);
    map.setCollisionBetween(995, 995, true, this.collisionLayer);

    this.collisionLayer.debug = true;

    //Change the world size to match the size of this layer
    this.collisionLayer.resizeWorld();

    // request objects to be displayed clientside
    this.newPlayer = Client.askNewPlayer();
    Client.askThings();

    // collision

    // create cursors to move player
    cursors = {
        w: Game.input.keyboard.addKey(Phaser.Keyboard.W),
        a: Game.input.keyboard.addKey(Phaser.Keyboard.A),
        s: Game.input.keyboard.addKey(Phaser.Keyboard.S),
        d: Game.input.keyboard.addKey(Phaser.Keyboard.D)
    };



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

    //Make the sprite collide with the collision layer
    game.physics.arcade.collide(this.newPlayer, this.collisionLayer);
};

Game.collidetest = function() {
    console.log("hello world");
}

/*
Adds a new player to the map, camera follow it
and returns the player's sprite to control
 */
Game.addNewPlayer = function(id, x, y){
    // spawn the sprite of player and define player
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
    player = Game.playerMap[id];

    // setup necessary physics to game
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;

    // top priority! (doesn't work)
    // TODO: make it work
    player.bringToTop()

    // setup camera to follow player
    Game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 1, 1);


    return player
};

// adds teleporters to dictionary
Game.addNewTeleporter = function(tpid, x, y) {
    teleporter = Game.teleporterMap[tpid];
    teleporter = game.add.sprite(x, y, 'teleporter');
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
    game.physics.enable(player);

    // move player according to keypress
    if (key == 'w') {
        player.body.velocity.y -= HIDER_SPEED;
    } else if (key == 'a') {
        player.body.velocity.x -= HIDER_SPEED;
    } else if (key == 's') {
        player.body.velocity.y += HIDER_SPEED;
    } else if (key == 'd') {
        player.body.velocity.x += HIDER_SPEED;
    }

    // update position to server
    Client.sendPosition(player.x, player.y)
};

// Teleportations
Game.teleporterCollied = function() {
    console.log('teleporter collided')
}

//Teleporting
Game.teleportPlayer = function(id, destX, destY) {

    var player = Game.playerMap[id];

    player.x = destX
    player.y = destY

    // update position to server
    Client.sendPosition(player.x, player.y)
}

