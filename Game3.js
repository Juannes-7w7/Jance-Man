var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level1', 'Mapas/Level 3/N1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'Mapas/Level 3/tiles-1.png');
    game.load.spritesheet('player', 'Ima/Personajes/P1.png', 34, 41);
    game.load.image('background', 'Ima/Fondos/F5.png');
    game.load.image('Door', 'Ima/Personajes/Puerta1.png');
    game.load.image('bullet', 'Ima/Personajes/boom.png');
    game.load.image('disparo', 'Ima/Personajes/disparo.png');
    game.load.audio('Fondo', 'Audios/F4.mp3');
    game.load.audio('Risa', 'Audios/Risas.mp3');
    game.load.audio('Adis', 'Audios/Disparo.mp3');
    game.load.audio('Aboom', 'Audios/Boom.mp3');
    game.load.audio('Mboom', 'Audios/BoomM.mp3');
    game.load.audio('ASalto', 'Audios/Salto.mp3');
    game.load.image('live', 'Ima/Personajes/vida.png');
    game.load.image('liveE', 'Ima/Personajes/vidaE.png');

    //Enemigos
    game.load.spritesheet('boss', 'Ima/Personajes/Boss.png', 100, 77);

}

var map;
var layer;
var player;
var facing;
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var boomButton;
var bullets;
var bulletTime = 0;
var fire;
var fireTime = 0;
var disparo;
var MF;
var MDisp;
var Mboom;
var MMboom;
var Risas;
var MSalto;
var boss;
var boss1;
var vida;
var vida1 = 100 ;
var vidatex;
var vidaE = 100;
var vidaa;
var vidaEtex; 
var bossSpeed = 3000;

function create() {

    MSalto = game.add.audio('ASalto');
    MDisp = game.add.audio('Adis');
    Mboom = game.add.audio('Aboom');
    MMboom = game.add.audio('Mboom');
    MF = game.add.audio('Fondo');
    MF.play();
    MF.loop = true;
    Risas = game.add.audio('Risa');
    Risas.play();
    Risas.loop = true;

    timerDeMuerte = this.add.text(300, 200);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 20;

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([12, 13, 14, 15, 16, 46, 47, 48, 49, 50]);

    layer = map.createLayer('Tile Layer 1');

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 250;

    puerta = game.add.physicsGroup();
    puerta.create(2300, 10, 'Door');

    player = game.add.sprite(32, 41, 'player');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2], 10, true);
    player.animations.add('turn1', [2], 0, true);
    player.animations.add('turn2', [5], 0, true);
    player.animations.add('right', [5, 6, 7], 10, true);
    player.animations.add('firexx', [8], 10, true);
    player.animations.add('firex', [9], 10, true);
    player.animations.add('firezz', [10], 10, true);
    player.animations.add('firez', [11], 10, true);

    game.camera.follow(player);

    //Enemigos
    boss1 = game.add.group();
    boss1.enableBody = true;
    boss1.physicsBodyType = Phaser.Physics.ARCADE;

    boss = boss1.create(10, 100, 'boss');
    boss.animations.add('a1', [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 6, 7, 8 , 9, 10, 11, 12, 13, 14, 15, 16 ,17], 5, true);
    boss.animations.play('a1', 3, true);

    var tween = game.add.tween(boss).to({ x: 1300 }, bossSpeed, Phaser.Easing.Linear.None, true, 0, 1000, true);
    //  When the tween loops it calls descend
    tween.onLoop.add(ascend, this);

    cursors = game.input.keyboard.createCursorKeys();

    //Saltar
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //Disparo bomba
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0);
    bullets.setAll('anchor.y', 0.25);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    boomButton = game.input.keyboard.addKey(Phaser.Keyboard.R);

    //Disparo
    fire = game.add.group();
    fire.enableBody = true;
    fire.createMultiple(30, 'disparo');
    fire.setAll('anchor.x', -1.5);
    fire.setAll('anchor.y', -2);
    fire.setAll('outOfBoundsKill', true);
    fire.setAll('checkWorldBounds', true);

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.E);

    //Vida
    vida = game.add.physicsGroup(false);
    vida.create(10, 15, 'live');
    vida.fixedToCamera = true;

    vidatex = game.add.text(10, 10, 'Vida', { font: '34px Arial', fill: '#fff' });
    vidatex.fixedToCamera = true;

    vidaa = game.add.physicsGroup(false);
    vidaa.create(10, 65, 'liveE');
    vidaa.fixedToCamera = true;

    vidaEtex = game.add.text(10, 60, 'Vida Boss', { font: '34px Arial', fill: '#fff' });
    vidaEtex.fixedToCamera = true;

}

var a = 0;
function update() {

    game.physics.arcade.collide(puerta, layer);
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(boss1, layer);
    game.physics.arcade.overlap(disparo, boss1, Matar, null, this);
    game.physics.arcade.overlap(bullets, boss1, Matar1, null, this);
    game.physics.arcade.overlap(player, boss1, Morir, null, this);
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        a = 0;
        player.body.velocity.x = -150;

        if (facing != 'left') {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown) {
        a = 1;
        player.body.velocity.x = 150;

        if (facing != 'right') {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else {
        if (facing != 'turn1') {
            player.animations.play('turn1');

            if (facing == 'turn1') {
                player.frame = 0;
            }
            else {
                player.frame = 5;
            }
            facing = 'turn2';
        }
    }

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        MSalto.play();
        player.body.velocity.y = -300;
        jumpTimer = game.time.now + 750;
    }
    if (boomButton.isDown) {
        fireBullet();
        if (a == 1) {
            Mboom.play();
            if (facing != 'firex') {
                player.animations.play('firex');
                facing = 'firex';
            }
        }
        else {
            Mboom.play();
            if (facing != 'firexx') {
                player.animations.play('firexx');
                facing = 'firexx';
            }
        }
    }
    if (fireButton.isDown) {
        firee();
        if (a == 1) {
            MDisp.play();
            if (facing != 'firez') {
                player.animations.play('firez');
                facing = 'firez';
            }
        }
        else {
            MDisp.play();
            if (facing != 'firezz') {
                player.animations.play('firezz');
                facing = 'firezzgb ';
            }
        }
    }

}

function fireBullet() {

    if (a == 1) {
        if (game.time.now > bulletTime) {

            bullet = bullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(player.x, player.y);
                bullet.body.velocity.x = +200;
                bullet.body.velocity.y = -150;
                bulletTime = game.time.now + 200;
            }
        }
    }

    else {
        if (game.time.now > bulletTime) {

            bullet = bullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(player.x + 22, player.y);
                bullet.body.velocity.x = -200;
                bullet.body.velocity.y = -150;
                bulletTime = game.time.now + 200;
            }
        }
    }
}

function firee() {

    if (a == 1) {
        if (game.time.now > fireTime) {

            disparo = fire.getFirstExists(false);

            if (disparo) {
                disparo.reset(player.x + 22, player.y + 5);
                disparo.body.velocity.x = +310;
                disparo.body.acceleration.y = -250;
                fireTime = game.time.now + 200;
            }
        }
    }

    else {
        if (game.time.now > fireTime) {
            disparo = fire.getFirstExists(false);

            if (disparo) {
                disparo.reset(player.x - 13, player.y + 5);
                disparo.body.velocity.x = -310;
                disparo.body.acceleration.y = -250;
                fireTime = game.time.now + 200;
            }
        }
    }
}

function Matar (disparo, boss) {
    
    if(vidaE==0){
        boss.animations.add('a1', [9, 10, 11, 12, 13, 14], 6, false);
        boss.animations.play('a1', 5, false);
        boss.animations.currentAnim.onComplete.add(function() {boss.kill();});
        disparo.kill();
    }
    else{
        bossSpeed-=50;
        vidaE-=0.2;
    } 
    vidaa.width = vidaE*7;

}

function Matar1 (bullets, boss) {

    if(vidaE==0){
        boss.animations.add('a1', [9, 10, 11, 12, 13, 14], 6, false);
        boss.animations.play('a1', 5, false);
        boss.animations.currentAnim.onComplete.add(function() {boss.kill();});
        bullets.kill();

        window.location.replace("Win.html");

    }
    else{
        vidaE-=0.5;
    } 
    vidaa.width = vidaE*7;    

}

function ascend() {boss.y -= 100;}

function Morir (player, boss) {

    vida.width = vida1*7;

    if(vida1==0){
        window.location.replace("Game Over.html");
    }
    else{
        vida1 -= 0.5;
        vidatex.text = 'Vida';
    }
}


function render() {

}
