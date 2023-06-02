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

/******************************************
 * 
 *  ОТСЛЕЖИВАНИЕ ПОЛОЖЕНИЯ КУРСОРА МЫШИ
 */

// переменная положения курсора по оси X
let mouseX;
// обновляем переменную положения курсора по оси X при двежении мышью
document.addEventListener('mousemove', function(event) {
    let canvasRect = canvas.getBoundingClientRect();
    mouseX = (event.clientX - canvasRect.left) / (canvasRect.right - canvasRect.left) * canvas.width;
}, false);

/****************************
 * 
 *   Проигрование звуков
 */

const BG_MUSIC = new Audio();

// массив с названием фоновых музык игры
const bgMusicsArr = [
    'bgm_2.mp3',
    'bgm_3.mp3',
    'bgm_1.mp3',
];
// выбераем случайную фоновую музыку
let bgMusicIndex = Math.floor(Math.random() * bgMusicsArr.length);

// функция для проигрования фоновых музык по очереди
function playBgMusic() {
    BG_MUSIC.src = SOUNDS_PATH + bgMusicsArr[bgMusicIndex];
    BG_MUSIC.play(); // включить выбранную из массива музыку
    bgMusicIndex++; // задать номер следующей музыки из массива
    // если это была последняя музыка - переключиться на первую
    if (bgMusicIndex === bgMusicsArr.length) bgMusicIndex = 0;
    // после окончания музыки вызываьб функцию "playBgMusic()"
    BG_MUSIC.addEventListener('ended', playBgMusic);
}

/*********************************
 * 
 *   ПОДГОТОВКА ИГРОВЫХ ДАННЫХ
 */

let ballsPower = 1;
let ballsArr = [];
let bricksArr = [];
let bonusesArr = [];
let platform;
let background;

let currentLevel = 0;
let isGamePlay = false;
let isOnPause = true;

/*****************
 * 
 *  ЗАПУСК ИГРЫ
 */

function userPushStart() {
    playBgMusic();
    fillCanvas();
    //previousTimeStamp = performance.now();
    //requestAnimationFrame( animation );

    document.body.onclick = () => {
        if (!isGamePlay) {
            // сбрасываем музыку победы/проигрыша, если она не доиграна
            SE['se_win.mp3'].currentTime = SE['se_win.mp3'].duration;
            SE['se_lose.mp3'].currentTime = SE['se_lose.mp3'].duration;
            bricksArr = []; // очищаем блоки
            fillCanvas(); // обнавляем уровень
            // заканчиваем трек и включаем следующий
            BG_MUSIC.currentTime = BG_MUSIC.duration; 
            BG_MUSIC.play();
        } else if (isOnPause) {
            isOnPause = false;
            previousTimeStamp = performance.now();
            requestAnimationFrame( animation );
        } else if (!isOnPause) {
            isOnPause = true;
        }
    };
}

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
        if (bricksArr.length === 0 || ballsArr.length === 0) {
            isGamePlay = false;
            bonusesArr = [];
            ballsArr = [];
            BG_MUSIC.pause();
            if (bricksArr.length === 0) {
                SE['se_win.mp3'].play();
                currentLevel++;
                if (currentLevel === levelsArr.length)
                    currentLevel = 0;
            } else {
                //currentLevel = 0;
                SE['se_lose.mp3'].play();
            }
        }
    }

    // запускаем занова анимацию
    if (!isOnPause) requestAnimationFrame( animation );
}
