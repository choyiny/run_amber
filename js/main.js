/**
 * Created by choyiny on 17/3/2017.
 */

// Initializes game in browser
var game = new Phaser.Game(20 * 40, 600, Phaser.AUTO, document.getElementById('game'));
game.state.add('Game', Game);
game.state.start('Game');

var Game = {};