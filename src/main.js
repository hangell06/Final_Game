"use strict"

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 1000,
    height: 800,
    backgroundColor: '78e4ff',
    scene: [Load, Platformer, end_screen]
}

var cursors;
var my = {sprite: {}, vfx: {}, text: {}};

const game = new Phaser.Game(config);