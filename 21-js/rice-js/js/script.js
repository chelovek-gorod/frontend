'use strict';

const info = document.querySelector('.info');

const road = document.querySelector('.road');
const roadWidth = road.clientWidth;
const carWidth = 100;
const screenOffset = 50;

// определения старта и финиша на экране в пикселях
const start = screenOffset;
const finish = roadWidth - carWidth - screenOffset;

// переменная, определяющая победителя
let winner;

// ускорение автомобиля с шансам в 30% до 0,01 (пиксель за шаг)
const getAcceleration = () => (Math.random() < 0.7) ? 0 : 0.01;

// добавление красного автомобиля на стартовую позицию
const carRedDiv = document.createElement('img');
carRedDiv.src = './src/images/car_red.png';
carRedDiv.className = 'car';
carRedDiv.style.left = start + 'px';
carRedDiv.style.bottom = 160 + 'px';
road.append( carRedDiv );

// carGreenDiv
const carGreenDiv = document.createElement('img');
carGreenDiv.src = './src/images/car_green.png';
carGreenDiv.className = 'car';
carGreenDiv.style.left = start + 'px';
carGreenDiv.style.bottom = 110 + 'px';
road.append( carGreenDiv );

// carBlueDiv
const carBlueDiv = document.createElement('img');
carBlueDiv.src = './src/images/car_blue.png';
carBlueDiv.className = 'car';
carBlueDiv.style.left = start + 'px';
carBlueDiv.style.bottom = 60 + 'px';
road.append( carBlueDiv );

// carYellowDiv
const carYellowDiv = document.createElement('img');
carYellowDiv.src = './src/images/car_yellow.png';
carYellowDiv.className = 'car';
carYellowDiv.style.left = start + 'px';
carYellowDiv.style.bottom = 10 + 'px';
road.append( carYellowDiv );

// описание объекта красного автомобиля
const carRed = {
    name: 'КРАСНЫЙ ОХОТНИК',
    img: carRedDiv,
    speed: 0,
    dist: start,

    move: function() {
        this.speed += getAcceleration(),
        this.dist += this.speed;
        this.img.style.left = this.dist + 'px';
    }
}

const carGreen = {
    name: 'ЗЕЛЕНАЯ КОБРА',
    img: carGreenDiv,
    speed: 0,
    dist: start,

    move: function() {
        this.speed += getAcceleration(),
        this.dist += this.speed;
        this.img.style.left = this.dist + 'px';
    }
}

const carBlue = {
    name: 'СИНИЙ ПРИЗРАК',
    img: carBlueDiv,
    speed: 0,
    dist: start,

    move: function() {
        this.speed += getAcceleration(),
        this.dist += this.speed;
        this.img.style.left = this.dist + 'px';
    }
}

const carYellow = {
    name: 'ЖЕЛТЫЙ СКОРПИОН',
    img: carYellowDiv,
    speed: 0,
    dist: start,

    move: function() {
        this.speed += getAcceleration(),
        this.dist += this.speed;
        this.img.style.left = this.dist + 'px';
    }
}

// запуск гонки
info.innerHTML = 'Для старта гонки кликните по экрану';

let isStartRice = false;
document.body.onclick = function() {
    if (!isStartRice) {
        isStartRice = true;
        carRedDiv.style.left = start + 'px';
        carGreenDiv.style.left = start + 'px';
        carBlueDiv.style.left = start + 'px';
        carYellowDiv.style.left = start + 'px';
        carRed.speed = 0;
        carRed.dist = start;
        carGreen.speed = 0;
        carGreen.dist = start;
        carBlue.speed = 0;
        carBlue.dist = start;
        carYellow.speed = 0;
        carYellow.dist = start;
        info.innerHTML =                   '-=3=-'       ;
        setTimeout( () => info.innerHTML = ' -2- ', 1000);
        setTimeout( () => info.innerHTML = '  1  ', 2000);
        setTimeout( () => {
            info.innerHTML =               'СТАРТ'       ; 
            startRice();
        }, 3000);
    }
}

function startRice() {
    // ускарение автомобилей с интервалом 7 миллисекунд, пока не выявлен победитель
    let riceLoop = setInterval( () => {
        let maxDist = Math.max(carRed.dist, carGreen.dist, carBlue.dist, carYellow.dist);
        if (maxDist >= finish) {
            clearInterval(riceLoop);
            switch (maxDist) {
                case carRed.dist    : winner = carRed.name; break;
                case carGreen.dist  : winner = carGreen.name; break;
                case carBlue.dist   : winner = carBlue.name; break;
                case carYellow.dist : winner = carYellow.name; break;
            }
            info.innerHTML = `Победитель - <b>${winner}<b>!`;
            winner = undefined;
            isStartRice = false;
        } else {
            carRed.move();
            carGreen.move();
            carBlue.move();
            carYellow.move();
        }
    }, 7);
}
