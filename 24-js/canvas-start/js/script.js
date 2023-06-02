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

/*********************
 * 
 *   ФОН
 */

ctx.fillStyle = '#003399';
ctx.fillRect(0, 0, vw, vh);

/*********************
 * 
 *  СНЕГ ВНИЗУ ЭКРАНА
 */

ctx.beginPath();
ctx.moveTo(vw, 450);
ctx.lineTo(vw, vh);
ctx.lineTo(0, vh);
ctx.lineTo(0, 450);
//                   ^x   ^y    X    Y
ctx.quadraticCurveTo(100, 425, 200, 450);
//                   ^x   ^y    X    Y
ctx.quadraticCurveTo(300, 475, 400, 450);
//                   ^x   ^y    X    Y
ctx.quadraticCurveTo(500, 425, 600, 450);
//                   ^x   ^y    X    Y
ctx.quadraticCurveTo(700, 475, 800, 450);
ctx.closePath();
ctx.fillStyle = '#ffffff';
ctx.fill();

/*********************
 * 
 *  ОБЛОКА
 */

function drawCloud(x, y) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(x - 60, y, 60, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 60, y, 60, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x, y - 20, 50, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x, y + 20, 50, 30, 0, 0, Math.PI * 2);
    ctx.fill();
}
drawCloud(650, 75);
drawCloud(450, 150);
drawCloud(210, 95);

/*********************
 * 
 *  ДОМ
 */

// дом
ctx.fillStyle = '#b3b3b3';
ctx.fillRect(50, 100, 220, 450);
// дверь
ctx.fillStyle = '#000000';
ctx.fillRect(130, 440, 60, 100);
// окна 1-го этажа
ctx.fillRect( 60, 440, 60, 50);
ctx.fillRect(200, 440, 60, 50);
// окна 2-го этажа
ctx.fillRect( 60, 360, 60, 50);
ctx.fillRect(130, 360, 60, 50);
ctx.fillRect(200, 360, 60, 50);
// окна 3-го этажа
ctx.fillRect( 60, 280, 60, 50);
ctx.fillRect(130, 280, 60, 50);
ctx.fillRect(200, 280, 60, 50);
// окна 4-го этажа
ctx.fillRect( 60, 200, 60, 50);
ctx.fillRect(130, 200, 60, 50);
ctx.fillRect(200, 200, 60, 50);
// окна 5-го этажа
ctx.fillRect( 60, 120, 60, 50);
ctx.fillRect(130, 120, 60, 50);
ctx.fillRect(200, 120, 60, 50);

/*********************
 * 
 *  ЁЛКА
 */

// ствол
ctx.fillStyle = '#663333';
ctx.fillRect(620, 380, 20, 120);
// ярусы
function drawGreenTriangle(x, y, base) {
    ctx.beginPath();
    ctx.fillStyle = '#00ff00';
    ctx.moveTo(x - base/2, y);
    ctx.lineTo(x + base/2, y);
    ctx.lineTo(x, y - base/2);
    ctx.lineTo(x - base/2, y);
    ctx.closePath();
    ctx.fill()
}
drawGreenTriangle(630, 450, 200);
drawGreenTriangle(630, 380, 160);
drawGreenTriangle(630, 320, 120);
drawGreenTriangle(630, 270, 80);

/*********************
 * 
 *  СНЕГОВИК
 */

function drawBall(x, y, size, fillColor, strokeColor) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();
    if (strokeColor) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    }
}
// тело
drawBall(vcx, 480, 40, '#ffffff', true);
drawBall(vcx, 430, 30, '#ffffff', true);
drawBall(vcx, 388, 22, '#ffffff', true);
// руки
drawBall(vcx - 36, 420, 13, '#ffffff', true);
drawBall(vcx + 36, 420, 13, '#ffffff', true);
// рот
drawBall(vcx - 12, 394, 2, '#000000');
drawBall(vcx -  7, 398, 3, '#000000');
drawBall(vcx     , 400, 3, '#000000');
drawBall(vcx +  7, 398, 3, '#000000');
drawBall(vcx + 12, 394, 2, '#000000');
// глаза
drawBall(vcx -  9, 382, 4, '#000000');
drawBall(vcx +  9, 382, 4, '#000000');
// нос
ctx.beginPath();
ctx.lineJoin = 'round';
ctx.moveTo(vcx + 3, 390);
ctx.lineTo(vcx - 17,396);
ctx.lineTo(vcx - 3, 386);
//                   ^x   ^y    X    Y
ctx.quadraticCurveTo(vcx + 3, 382, vcx + 3, 390);
ctx.fillStyle = '#ff6600';
ctx.fill();
ctx.strokeStyle = '#000000';
ctx.stroke();

/*************************
 * 
 *  ОТРИСОВКА СНЕЖИНОК
 */

function drawSnowflake(x, y) {
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffffff';
    
    ctx.beginPath();
    // луч - 1
    ctx.moveTo(x +  5, y - 22);
    ctx.lineTo(x -  5, y + 22);
    // луч - 2
    ctx.moveTo(x + 20, y - 13);
    ctx.lineTo(x - 20, y + 13);
    // луч - 3
    ctx.moveTo(x + 23, y + 5);
    ctx.lineTo(x - 23, y - 5);
    // луч - 4
    ctx.moveTo(x + 12, y + 20);
    ctx.lineTo(x - 12, y - 20);

    ctx.stroke();

    // кольцо
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.stroke();
}
drawSnowflake(330, 330);
drawSnowflake(370, 240);
drawSnowflake(490, 290);
drawSnowflake(560, 220);
drawSnowflake(610, 380);
drawSnowflake(710, 190);