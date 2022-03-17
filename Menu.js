var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'Jance-man', { preload: preload, create: create });

function preload() {

    game.load.spritesheet('button', 'Ima/Botones/B1.png', 193, 71);
    game.load.image('background1','Ima/Fondos/F1.png');
    game.load.image('background2','Ima/Fondos/F2.png');
    game.load.audio('Fondo', 'Audios/F.mp3');

}

var button;
var background;
var MF;

function create() {

    MF = game.add.audio('Fondo');
    MF.play();
    MF.loop = true;

    background = game.add.tileSprite(0, 0, 800, 600, 'background1');

    button = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);

    button.onInputOver.add(over, this);
    button.onInputOut.add(out, this);
    button.onInputUp.add(up, this);

}

function up() {
    
    console.log('button up');
}

function over() {
    background = game.add.tileSprite(0, 0, 800, 600, 'background2');
    button = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);
    console.log('button over');
    
}

function out() {
    background = game.add.tileSprite(0, 0, 800, 600, 'background1');
    button = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);
    console.log('button out');
    
}

function actionOnClick () {

    window.location.replace("Level1.html");

}