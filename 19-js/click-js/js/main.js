'use strict';

/************************
 * 
 *  НАСТРОЙКИ ИГРЫ
 * 
 */

const GAME_NAME = 'КлИкЕр!'; /* название игры */
const GAME_TIME = 30;  /* время игры (в секундах) */
const TARGET_SIDE = 120; /* стороны блока (в пикселях) */
const TARGET_REPLACE_TIME = 1; /* начальная скорость изменения положения блока (в секундах) */

const TARGET_REPLACE_TIME_RANGE = 1.05;
const START_SCORES = 100;
const SCORES_ADD_RANGE = 1.2;

// очки и рекорд при старте игры
let bestResult = 0;
let scores = 0;

let scoresAdd = START_SCORES;

/*************************************
 * 
 *  ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ СТРАНИЦЫ
 * 
 */

// Верхняя панель с информацией о текущей игре
const divInfo = document.getElementById('info');
const infoScores = document.getElementById('info-scores').querySelector('span');
infoScores.innerHTML = scores; // указываем текущее число очкрв
const infoTimer = document.getElementById('info-timer').querySelector('span');
infoTimer.innerHTML = GAME_TIME; // указываем текущее время игры
const infoBest = document.getElementById('info-best').querySelector('span');
infoBest.innerHTML = bestResult; // указываем последний рекорд


// Стартовый блок с названием и правилами игры, при клике - запускается игру
const divMenu = document.getElementById('menu');
divMenu.onclick = startGame; // слушатель события клика по блоку
const menuTitle = divMenu.querySelector('h1').querySelector('span');
menuTitle.innerHTML = GAME_NAME; // Добавляем заголовок игры
const menuTimer = divMenu.querySelector('p').querySelector('span');
menuTimer.innerHTML = GAME_TIME; // Добавляем время на игру
const menuBest = divMenu.querySelector('h2').querySelector('span');
menuBest.innerHTML = bestResult; // Добавляем лучший результат

// Игровая область
const divGame = document.getElementById('game');

// Блок, по которому нужно кликать, для получения очков
const divTarget = document.getElementById('target');
divTarget.onclick = getTargetClick; // слушатель события клика по блоку

// Всплывающий блок, указывающий число полученных очков, при клике по цели
const divScores = document.getElementById('scores');

/**************************************
 * 
 *  РАСЧЕТ РАЗМЕРОВ ИГРОВОЙ ОБЛАСТИ
 * 
 */

const sidePaddings = 20; // отступ от края окна и игровой информации (в пикселях)
// определение высоты верхней панель с информацией о текущей игре с двойным отступом
const infoHeight =  Math.ceil( divInfo.clientHeight ) + sidePaddings * 2;
const gameWidth = innerWidth - sidePaddings * 2; // определение доступной ширины
const gameHeight = innerHeight - infoHeight - sidePaddings; // и высоты

// определение максимального числа блоков для кликов по ширине и высоте игровой облости
const targetsInWidth = Math.floor( gameWidth / TARGET_SIDE );
const targetsInHeight = Math.floor( gameHeight / TARGET_SIDE );

// задать размеры игровой области
divGame.style.width = targetsInWidth * TARGET_SIDE + 'px';
divGame.style.height = targetsInHeight * TARGET_SIDE + 'px';

// задать размеры блоку для кликов
divTarget.style.width = TARGET_SIDE + 'px';
divTarget.style.height = TARGET_SIDE + 'px';

/*************************
 * 
 *  ИГРОВЫЕ ПЕРЕМЕННЫЕ
 * 
 */

let gameTime, // таймер игры (для обратного отсчета секунд)
    targetReplaceTime, // время для смены позицииблока для кликов
    targetReplaceInterval; // интервал смены позицииблока для кликов

/*************************
 * 
 *  ИГРОВЫЕ ФУНКЦИИ
 * 
 */

// старт игры
function startGame() {
    /* ВАШ КОД */
    /* Скрыть стартовое игровое меню <div id="menu">
    и показать игровую область <div id="game"> (display flex)
    */
    divMenu.style.display = 'none';
    divGame.style.display = 'flex';
    /* ------- */

    scoresAdd = START_SCORES;
    scores = 0; // обнулить набронное ранее число очков
    infoScores.innerHTML = scores;
    gameTime = GAME_TIME; // обнулить таймер игры
    infoTimer.innerHTML = gameTime;
    // стартовое время смены положения блока для кликов
    targetReplaceTime = TARGET_REPLACE_TIME * 1000;

    // перемещение блок для кликов в случайное положение
    replaceTargetDiv();

    // запустить таймер обнавления игрового времени
    setTimeout( gameTimer, 1000 );

    /* ВАШ КОД */
    /* Запустите интервал смены положения блока для кликов, сохранив его в переменную targetReplaceInterval
    интервал вызывает функцию перемещающую блок для кликов в случайное положение replaceTargetDiv
    через заданный временной интервал targetReplaceTime
    */
    targetReplaceInterval = setInterval( replaceTargetDiv, targetReplaceTime );
    /* ------- */
}

// обновить позицию блока для кликов
function replaceTargetDiv() {
    /* ВАШ КОД */
    /* задайте блоку <div id="target"> CSS-свойства left и top
    left - случайное число от 0 до targetsInWidth (число блоков по ширине игровой области), умноженного на TARGET_SIDE
    top - случайное число от 0 до targetsInHeight (число блоков по высоте игровой области), умноженного на TARGET_SIDE 
    */
    divTarget.style.left = Math.floor( Math.random() * targetsInWidth ) * TARGET_SIDE + 'px';
    divTarget.style.top = Math.floor( Math.random() * targetsInHeight ) * TARGET_SIDE + 'px';
    /* ------- */
}

// клик по целе
function getTargetClick() {
    targetReplaceTime = Math.floor(targetReplaceTime / TARGET_REPLACE_TIME_RANGE);

    /* ВАШ КОД */
    /* 
    Обновите позицию блока для кликов.
    Очистите интервал смены положения блока для кликов (хранится в переменной targetReplaceInterval),
    что бы обновить время автоматической смены положения блока, после клика по нему. 
    После этого запустите интервал занова (сохранив его в переменную targetReplaceInterval)
    интервал вызывает функцию перемещающую блок для кликов в случайное положение replaceTargetDiv
    через заданный временной интервал targetReplaceTime
    */
    replaceTargetDiv();
    clearInterval( targetReplaceInterval );
    targetReplaceInterval = setInterval( replaceTargetDiv, targetReplaceTime );
    /* ------- */

    // обновление набранных очков
    scores += scoresAdd;
    infoScores.innerHTML = scores;

    // показать набронное число очков за клик
    divScores.innerHTML = '+' + scoresAdd;
    divScores.classList.remove('show');
    // добавляем класс 'show' через ivent loop,
    // что бы браузер успел сначало удалить класс 'show'
    // а добавил его только после удаления
    // (появление класса 'show' запускает CSS-анимацию)
    setTimeout( () => divScores.classList.add('show'), 0 );

    scoresAdd = Math.floor(scoresAdd * SCORES_ADD_RANGE);
}

// обновление игрового таймера
function gameTimer() {
    gameTime--;
    infoTimer.innerText = gameTime;
    // проверкая завершения игрового времени
    if (gameTime > 0) setTimeout( gameTimer, 1000 );
    else gameEnd();
}

// завершение игры
function gameEnd() {
    divTarget.style.display = 'none';
    clearInterval( targetReplaceInterval );

    // обновляем рекорд, если он побит
    if (scores > bestResult) {
        bestResult = scores;
        infoBest.innerHTML = bestResult;
        menuBest.innerHTML = bestResult;
    }

    setTimeout( () => {
        divMenu.style.display = 'block';
        divGame.style.display = 'none';
        divTarget.style.display = 'block';
        divScores.innerHTML = '';
    }, 1500 );
}
