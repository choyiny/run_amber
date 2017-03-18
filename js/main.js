/**
 * Cho Yin Yong, Youyee Chen 2017
 * RUN AMBER - A Game of Hide and Seek (maybe)
 * Made with <3 for RUHacks 2017
 * Version 0.1.1
 *
 * Main
 *
 */

// Initializes game in browser
var game = new Phaser.Game(20 * 30, 600, Phaser.AUTO, document.getElementById('game'));
game.state.add('Game', Game);
game.state.start('Game');