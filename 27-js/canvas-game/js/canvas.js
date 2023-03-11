'use strict';

/*************
 * 
 *   CANVAS
 */

let vw, vh, vcx, vcy;
const canvas = document.createElement('canvas');
canvas.width = vw = 960;
canvas.height = vh = 704;
vcx = Math.floor(vw / 2);
vcy = Math.floor(vh / 2);
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, vw, vh);
document.body.prepend(canvas);

/*
const SOUNDS_ARR []
const IMAGES_ARR []
userPushStart ()
*/

function userPushStart() {
    playSeGame('se_start.mp3');
    playBgMusic();
    fillCanvas();
    previousTimeStamp = performance.now();
    requestAnimationFrame( animation );
}

/****************************
 * 
 *   Проигрование звуков
 */

const BG_MUSIC = new Audio();
const SE_SOUND = new Audio();
const SE_BONUS = new Audio();
// массив с названием фоновых музык игры
const bgMusicsArr = [
    'bgm_2.mp3',
    'bgm_3.mp3',
    'bgm_1.mp3',
];
let bgMusicIndex = Math.floor(Math.random() * bgMusicsArr.length); // начинать проигрование фоновой музыки с первой

// функция для проигрования фоновых музык по очереди
function playBgMusic() {
    BG_MUSIC.src = SOUNDS_PATH + bgMusicsArr[bgMusicIndex];
    BG_MUSIC.play(); // включить выбранную из массива музыку
    bgMusicIndex++; // задать номер следующей музыки из массива
    // если это была последняя музыка в массиве - переключиться на первую
    if (bgMusicIndex === bgMusicsArr.length) bgMusicIndex = 0;
    // отслеживать окончания музыки, после чего вызываьб функцию "playBgMusic()" повторно
    BG_MUSIC.addEventListener('ended', playBgMusic);
}

function playSeGame(sound_name) {
    SE_SOUND.src = SOUNDS_PATH + sound_name;
    SE_SOUND.play(); // включить выбранный звук
}

function playSeBonus(sound_name) {
    SE_BONUS.src = SOUNDS_PATH + sound_name;
    SE_BONUS.play(); // включить выбранный звук
}

/*************
 * 
 *   УРОВЕНЬ
 */

let isGamePlay = true;
const level = [
/* 000 032 064 096 128 160 192 224 256 288 320 352 384 416 448 480 512 544 576 608 640 672 704 736 768 800 832 864 896 928 960*/
/*  |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |*///_000
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],//_032
    [' ','1',' ','2',' ','3',' ','3',' ','B',' ','3',' ','2',' ','2',' ','3',' ','B',' ','3',' ','3',' ','2',' ','1',' ',' ',],//_064
    [' ',' ','2',' ','3',' ','4',' ','5',' ','6',' ','5',' ','B',' ','5',' ','6',' ','5',' ','4',' ','3',' ','2',' ',' ',' ',],//_096
    [' ',' ',' ','1',' ','1',' ','B',' ','1',' ','B',' ','1',' ','1',' ','B',' ','1',' ','B',' ','1',' ','1',' ',' ',' ',' ',],//_128
    [' ',' ',' ',' ','2',' ','2',' ','2',' ','2',' ','2',' ','2',' ','2',' ','2',' ','2',' ','2',' ','2',' ',' ',' ',' ',' ',],//_160
    [' ',' ',' ',' ',' ','2',' ','2',' ','2',' ','2',' ','2',' ','2',' ','2',' ','2',' ','2',' ','2',' ',' ',' ',' ',' ',' ',],//_192
    [' ',' ',' ',' ',' ',' ','3',' ','B',' ','3',' ','B',' ','3',' ','B',' ','3',' ','B',' ','3',' ',' ',' ',' ',' ',' ',' ',],//_224
    [' ',' ',' ',' ',' ',' ',' ','3',' ','3',' ','3',' ','3',' ','3',' ','3',' ','3',' ','3',' ',' ',' ',' ',' ',' ',' ',' ',],//_256
    [' ',' ',' ',' ',' ',' ',' ',' ','2',' ','2',' ','2',' ','2',' ','2',' ','2',' ','2',' ',' ',' ',' ',' ',' ',' ',' ',' ',],//_288
    [' ',' ',' ',' ',' ',' ',' ',' ',' ','1',' ','1',' ','1',' ','1',' ','1',' ','1',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],//_320
    [' ',' ',' ','6',' ','6',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','6',' ','6',' ',' ',' ',' ',],//_352
    [' ',' ','6',' ','B',' ','6',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','6',' ','B',' ','6',' ',' ',' ',],//_384
    [' ',' ',' ','6',' ','6',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','6',' ','6',' ',' ',' ',' ',],//_416
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],//_448
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],//_480
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],//_512
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],//_544
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],//_576
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],//_608
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],//_640
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],//_672
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],//_704
];

let ballsPower = 1;
let ballsArr = [];
let bricksArr = [];
let bonusesArr = [];
let platform;
let background;

/*
Sprite (imageName, x, y)
Brick extends Sprite (imageName, x, y, frameWidth, frameHeight, hp)
BonusBrick extends Brick (imageName, x, y, frameWidth, frameHeight, hp)
Platform extends Sprite (imageName, x, y)
Ball extends Sprite (imageName, x, y)
Bonus extends Sprite (imageName, x, y)
Background extends Sprite (imageName, x, y)
*/

function fillCanvas() {
    let levelStep = 32
    for (let yy = 0; yy < level.length; yy++) {
        for (let xx = 0; xx < level[yy].length; xx++) {
            let hp = +level[yy][xx];
            if ( hp )
                bricksArr.push( new Brick('block-64x32-6f.png', xx * levelStep, yy * levelStep, 64, 32, hp) );
            else if (level[yy][xx] === 'B')
                bricksArr.push( new BonusBrick('block-bonus-64x32-64f.png', xx * levelStep, yy * levelStep, 64, 32, 1) );
        }
    }
    platform = new Platform('platform.png', Math.floor(vw / 2), vh - 64);
    ballsArr.push( new Ball('ball.png', Math.floor(vw / 2) + 16, vh - 128) );
    background = new Background('bg.jpg', 0, 0);
}

/******************************************
 * 
 *  ОТСЛЕЖИВАНИЕ ПОЛОЖЕНИЯ КУРСОРА МЫШИ
 */

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

document.addEventListener('mousemove', function(event) {
    let rect = canvas.getBoundingClientRect();
    mouseX = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    mouseY = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
}, false);

/**************
 * 
 *  АНИМАЦИЯ
 */

let previousTimeStamp;
function animation(timeStamp) {
    // обновляем временные метки
    const dt = timeStamp - previousTimeStamp;
    previousTimeStamp = timeStamp;

    // обнавляем canvas
    ctx.clearRect(0, 0, vw, vh);
    background.update();

    platform.update(dt);
    ballsArr.forEach( ball => ball.update(dt) );
    bricksArr.forEach( brick => brick.update(dt) );
    bonusesArr.forEach( bonus => bonus.update(dt) );

    bonusesArr = bonusesArr.filter( bonus => bonus.isExist );
    bricksArr = bricksArr.filter( brick => brick.isExist );
    ballsArr = ballsArr.filter( ball => ball.isExist );

    if (isGamePlay) {
        if (bricksArr.length === 0) {
            isGamePlay = false;
            BG_MUSIC.src = SOUNDS_PATH + 'se_win.mp3';
            BG_MUSIC.play();
        }
        else if (ballsArr.length === 0) {
            isGamePlay = false;
            BG_MUSIC.src = SOUNDS_PATH + 'se_lose.mp3';
            BG_MUSIC.play();
        }
    }

    // запускаем занова анимацию
    requestAnimationFrame( animation );
}