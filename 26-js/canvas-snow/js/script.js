'use strict';

/*********************
 * 
 *   ПОДГОТОВКА
 */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

document.body.prepend(canvas);

let vw, vh, vcx, vcy;

canvas.width = vw = 800;
canvas.height = vh = 600;
canvas.style.width = vw + 'px';
canvas.style.height = vh + 'px';
vcx = Math.floor(vw / 2);
vcy = Math.floor(vh / 2);

/************
 * 
 *   ФОН
 */

const background = document.createElement('canvas');
const bgс = background.getContext('2d');
background.width = vw;
background.height = vh;

// фоновый цвет
bgс.fillStyle = '#003399';
bgс.fillRect(0, 0, vw, vh);
    
// снег внизу экрана
bgс.beginPath();
bgс.moveTo(vw, 450);
bgс.lineTo(vw, vh);
bgс.lineTo(0, vh);
bgс.lineTo(0, 450);
//                   ^x   ^y    X    Y
bgс.quadraticCurveTo(100, 425, 200, 450);
//                   ^x   ^y    X    Y
bgс.quadraticCurveTo(300, 475, 400, 450);
//                   ^x   ^y    X    Y
bgс.quadraticCurveTo(500, 425, 600, 450);
//                   ^x   ^y    X    Y
bgс.quadraticCurveTo(700, 475, 800, 450);
bgс.closePath();
bgс.fillStyle = '#ffffff';
bgс.fill();

// облока
function drawCloud(x, y) {
    bgс.fillStyle = '#ffffff';
    bgс.beginPath();
    bgс.ellipse(x - 60, y, 60, 30, 0, 0, Math.PI * 2);
    bgс.fill();
    bgс.beginPath();
    bgс.ellipse(x + 60, y, 60, 30, 0, 0, Math.PI * 2);
    bgс.fill();
    bgс.beginPath();
    bgс.ellipse(x, y - 20, 50, 30, 0, 0, Math.PI * 2);
    bgс.fill();
    bgс.beginPath();
    bgс.ellipse(x, y + 20, 50, 30, 0, 0, Math.PI * 2);
    bgс.fill();
}
drawCloud(650, 75);
drawCloud(450, 150);
drawCloud(210, 95);

// дом - каркасс
bgс.fillStyle = '#b3b3b3';
bgс.fillRect(50, 100, 220, 450);
// дом - дверь
bgс.fillStyle = '#000000';
bgс.fillRect(130, 440, 60, 100);
// дом - окна 1-го этажа
bgс.fillRect( 60, 440, 60, 50);
bgс.fillRect(200, 440, 60, 50);
// дом - окна 2-го этажа
bgс.fillRect( 60, 360, 60, 50);
bgс.fillRect(130, 360, 60, 50);
bgс.fillRect(200, 360, 60, 50);
// дом - окна 3-го этажа
bgс.fillRect( 60, 280, 60, 50);
bgс.fillRect(130, 280, 60, 50);
bgс.fillRect(200, 280, 60, 50);
// дом - окна 4-го этажа
bgс.fillRect( 60, 200, 60, 50);
bgс.fillRect(130, 200, 60, 50);
bgс.fillRect(200, 200, 60, 50);
// дом - окна 5-го этажа
bgс.fillRect( 60, 120, 60, 50);
bgс.fillRect(130, 120, 60, 50);
bgс.fillRect(200, 120, 60, 50);

// ель - ствол
bgс.fillStyle = '#663333';
bgс.fillRect(620, 380, 20, 120);
// ель - ярусы
function drawGreenTriangle(x, y, base) {
    bgс.beginPath();
    bgс.fillStyle = '#00ff00';
    bgс.moveTo(x - base/2, y);
    bgс.lineTo(x + base/2, y);
    bgс.lineTo(x, y - base/2);
    bgс.lineTo(x - base/2, y);
    bgс.closePath();
    bgс.fill()
}
drawGreenTriangle(630, 450, 200);
drawGreenTriangle(630, 380, 160);
drawGreenTriangle(630, 320, 120);
drawGreenTriangle(630, 270, 80);

// снеговик
function drawBall(x, y, size, fillColor, strokeColor) {
    bgс.beginPath();
    bgс.arc(x, y, size, 0, Math.PI * 2);
    bgс.fillStyle = fillColor;
    bgс.fill();
    if (strokeColor) {
        bgс.lineWidth = 1;
        bgс.strokeStyle = '#000000';
        bgс.stroke();
    }
}
// снеговик - тело
drawBall(vcx, 480, 40, '#ffffff', true);
drawBall(vcx, 430, 30, '#ffffff', true);
drawBall(vcx, 388, 22, '#ffffff', true);
// снеговик - руки
drawBall(vcx - 36, 420, 13, '#ffffff', true);
drawBall(vcx + 36, 420, 13, '#ffffff', true);
// снеговик - рот
drawBall(vcx - 12, 394, 2, '#000000');
drawBall(vcx -  7, 398, 3, '#000000');
drawBall(vcx     , 400, 3, '#000000');
drawBall(vcx +  7, 398, 3, '#000000');
drawBall(vcx + 12, 394, 2, '#000000');
// снеговик - глаза
drawBall(vcx -  9, 382, 4, '#000000');
drawBall(vcx +  9, 382, 4, '#000000');
// снеговик - нос
bgс.beginPath();
bgс.lineJoin = 'round';
bgс.moveTo(vcx + 3, 390);
bgс.lineTo(vcx - 17,396);
bgс.lineTo(vcx - 3, 386);
//                   ^x   ^y    X    Y
bgс.quadraticCurveTo(vcx + 3, 382, vcx + 3, 390);
bgс.fillStyle = '#ff6600';
bgс.fill();
bgс.strokeStyle = '#000000';
bgс.stroke();

/**************
 * 
 *  СНЕЖИНКА
 */

const snowflake = document.createElement('canvas');
const sfc = snowflake.getContext('2d');
snowflake.width = snowflake.height = 52;
snowflake.cx = snowflake.cy = 26;

// рисуем снежинку
sfc.lineWidth = 6;
sfc.lineCap = 'round';
sfc.strokeStyle = '#eeeeee';

sfc.beginPath();
// луч - 1
sfc.moveTo(snowflake.cx +  5, snowflake.cy - 22);
sfc.lineTo(snowflake.cx -  5, snowflake.cy + 22);
// луч - 2
sfc.moveTo(snowflake.cx + 20, snowflake.cy - 13);
sfc.lineTo(snowflake.cx - 20, snowflake.cy + 13);
// луч - 3
sfc.moveTo(snowflake.cx + 23, snowflake.cy + 5);
sfc.lineTo(snowflake.cx - 23, snowflake.cy - 5);
// луч - 4
sfc.moveTo(snowflake.cx + 12, snowflake.cy + 20);
sfc.lineTo(snowflake.cx - 12, snowflake.cy - 20);

sfc.stroke();

// кольцо
sfc.beginPath();
sfc.arc(snowflake.cx, snowflake.cy, 18, 0, Math.PI * 2);
sfc.stroke();

/********************************************************
 * 
 *   ФУНКЦИЯ ВРАЩЕНИЯ ИЗОБРАЖЕНИЯ
 * 
 *   обязательные поля изображения:
 *   image.img- изображение или canvas
 *   image.cx - центр изображения по X (center x)
 *   image.cy - центр изображения по Y (center y)
 *   image.w  - ширины изображения (width)
 *   image.h  - высоты изображения (height)
 *   image.hw - половина ширины изображения (half width)
 *   image.hh - половина высоты изображения (half height)
 *   image.ang- угол поворота в градусах
 */

const MathPiDiv180 = Math.PI / 180;

function drawRotatedImage( image ) {
    ctx.setTransform(image.scale, 0, 0, image.scale, image.cx, image.cy);
    ctx.rotate(image.ang * MathPiDiv180);
    ctx.drawImage(image.img, 0, 0, image.w, image.h, -image.hw, -image.hh, image.w, image.h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// максимум снежинок на экране
const snowflakesOnScreen = 50;

// скорость снежинки (пикселей в секунду)
const snowflakeSpeedPixPerSec = 30;
const snowflakeSpeedPixPerMs = snowflakeSpeedPixPerSec / 1000;
// расчет числа кадров для полного пролета снежинкой всей высоты экрана
const snowflakeMoveThrowScreenFrames = Math.round(vh / snowflakeSpeedPixPerMs);
// расчет времени в кадрах для добавления новой снежинки чтобы равномерно заполнить экран
const addSnowflakeTimeout = Math.round(snowflakeMoveThrowScreenFrames / snowflakesOnScreen);
let addSnowflakeTimeStamp = addSnowflakeTimeout;
// смещение снежинок по оси X
const snowflakeAmplitudeX = 26;

// массив снежинок
let snowflakesArr = [];

// генератор снежинок
function addSnowflake() {
    let xx = Math.floor( Math.random() * vw );
    let scale = 0.5 + Math.random() / 2;
    const sf = {
        img: snowflake,
        cx : xx,
        cy : -snowflake.cy,
        w  : snowflake.width,
        h  : snowflake.height,
        hw : snowflake.cx,
        hh : snowflake.cy,
        ang: 0,
        scale: scale,
        aSpeed : Math.random() * 0.02 + 0.02,
        ySpeed : snowflakeSpeedPixPerMs,
        xSpeed : snowflakeSpeedPixPerMs / 1.5,
        xToLeftIs : Math.random() > 0.5 ? true : false,
        xMax : xx + snowflakeAmplitudeX,
        xMin : xx - snowflakeAmplitudeX,
    };
    snowflakesArr.push(sf);
}

// обновление и отрисовка снега
function drawSnowflake ( sf, dt ) {
    drawRotatedImage( sf );

    if (sf.xToLeftIs) {
        sf.cx -= sf.xSpeed * dt;
        if (sf.cx <= sf.xMin) sf.xToLeftIs = false;
    } else {
        sf.cx += sf.xSpeed * dt;
        if (sf.cx >= sf.xMax) sf.xToLeftIs = true;
    }
    sf.ang += sf.aSpeed * dt;
    sf.cy  += sf.ySpeed * dt;
    if ( sf.cy - sf.hh >= vh) {
        sf.cy = -sf.hh;
        sf.cx = Math.floor( Math.random() * vw );
        sf.scale = 0.5 + Math.random() / 2;
    }
}

/*************************
 * 
 *  АНИМАЦИЯ СНЕГОПАДА
 */

let previousTimeStamp = 0;
function animation(timeStamp) {
    // обновляем временные метки
    const dt = timeStamp - previousTimeStamp;
    previousTimeStamp = timeStamp;

    // очистка canvas
    ctx.clearRect(0, 0, vw, vh);

    // перерисовываем фон
    ctx.drawImage(background, 0, 0);

    // перересовываем каждую снежинку
    snowflakesArr.forEach( sf => drawSnowflake(sf, dt) );

    // проверяем необходимость добавления новой снежинки
    if ( snowflakesArr.length < snowflakesOnScreen
    && timeStamp >= addSnowflakeTimeStamp) {
        addSnowflake();
        addSnowflakeTimeStamp += addSnowflakeTimeout;
    }

    // запускаем занова анимацию
    requestAnimationFrame( animation );
}

// запускаем анимацию
animation(0);
