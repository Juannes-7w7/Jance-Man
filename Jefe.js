var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'Jance-man', { preload: preload, create: create, update:update });

function preload() {

    game.load.video('jefe', '/Ima/Fondos/jefe.mp4');
    game.load.audio('Fondo', 'Audios/risa.mp3');

}

var background;
var MF;
var video1;
var video;
var sprite;
var Button;

function create() {

    MF = game.add.audio('Fondo');
    MF.play();
    MF.loop = true;

    video = game.add.video('jefe');
    video.play(true);

    //  x, y, anchor x, anchor y, scale x, scale y
    video.addToWorld(350, 300, 0.5, 0.5,0.5,0.5);

    Button = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update(){
    if (Button.isDown) {
        window.location.replace("Level3.html");
    }
}



