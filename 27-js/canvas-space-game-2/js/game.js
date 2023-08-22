'use strict';

/*
**  ИГРОВОЙ ПРОЦЕСС
*/

// запуск полноэкранного режима
document.body.requestFullscreen();

// отключаем курсор по умолчанию
document.body.style.cursor = 'none';

// запускаем случайную фоновую музыку в половину громкости
const bgMusicArr = [
    'bgm_space_1.mp3',
    'bgm_space_2.mp3',
    'bgm_space_3.mp3',
    'bgm_space_4.mp3',
    'bgm_space_5.mp3',
    'bgm_space_6.mp3',
    'bgm_space_7.mp3',
    'bgm_space_8.mp3',
];
bgMusicArr.sort(() => Math.random() - 0.5);
playBgMusic(bgMusicArr, Math.floor(Math.random() * bgMusicArr.length));
BG_MUSIC.volume = 0.7;

IS_SOUND_EFFECTS_ON = true;

// создаем игровой курсор
const gameCursor = new GameCursor();
gameCursor.direction = _RAD * 45;

const bgSpeedRate = 1.2;
//let bgSpeed = 0.004;
let bgSpeed = 0.02;
function getBgSpeed( zIndex = 0 ) {
    return +(bgSpeed * bgSpeedRate**zIndex).toFixed(3);
}

// создаем прокручивающийся игровой фон
const bgTilesArr = [
    //                    имя файла с изображением, скорость прокрутки
    new ScrollingBackground('space_bg_tile_1600x2760px.jpg', getBgSpeed(0)),
    new ScrollingBackground('space_bg_alpha_tile_1440x724px.png', getBgSpeed(1)),
];

// создаем прокручивающиеся фоновые элементы космоса
const bgSpaceObjectsArr = [
    // имя файла с изображением, скорость прокрутки, время задержки (миллисекунд)
    new BackgroundSprite('galaxy_480x420px.png', getBgSpeed(3), 120000),
    new BackgroundSprite('nebula_1071x1328px.png', getBgSpeed(2), 35000),
    new BackgroundSprite('nebula_1250x1345px.png', getBgSpeed(2.2), 40000),
    new BackgroundSprite('star_dust_1184x842px.png', getBgSpeed(2.4), 18000),
    new BackgroundSprite('star_dust_1316x683px.png', getBgSpeed(2.6), 17000),
    new BackgroundSprite('star_dust_1388x774px.png', getBgSpeed(2.8), 16000),
    new BackgroundSprite('star_94x94px.png', getBgSpeed(3.5), 20000),
    new BackgroundSprite('star_106x106px.png', getBgSpeed(4), 25000),
];

// создаем прокручивающиеся фоновые планеты
const bgPlanetsArr = [
    // имя файла с изображением, скорость прокрутки, время задержки (миллисекунд)
    new BackgroundSprite('sun_red_580x580px.png', getBgSpeed(5), 240000),
    new BackgroundSprite('sun_yellow_552x552px.png', getBgSpeed(6), 200000),
    new BackgroundSprite('planet_256x256px.png', getBgSpeed(7), 170000),
    new BackgroundSprite('planet_204x204px.png', getBgSpeed(7.5), 140000),
    new BackgroundSprite('planet_154x154px.png', getBgSpeed(8), 120000),
    new BackgroundSprite('planet_128x128px.png', getBgSpeed(8.5), 100000),
    new BackgroundSprite('planet_102x102px.png', getBgSpeed(9), 80000),
    new BackgroundSprite('planet_76x76px.png', getBgSpeed(9.5), 67000),
    new BackgroundSprite('space_station_598x408px.png', getBgSpeed(10), 180000),
];

// создаем звезды
let starsArr = [];
const starProbability = 0.01;
function addStar() {
    const x = Math.random() * VIEW.width;
    const y = Math.random() * VIEW.height;
    // имя файла с изображением, x, y, ширина кадра, высота кадра, количество кадров, скорость анимации (FPS)
    const star = new OneLoopSpriteSheet('star_flash_32x32px_11frames.png', x, y, 32, 32, 11, 18);
    starsArr.push(star);
}

// пример временного текста
let messagesArr = [];
function addMessage() {
    //                          текст, координата x, координата y, контейнер
    messagesArr.push( new MessageText( '+1000', VIEW.x, VIEW.y, messagesArr ) )
}

//////////////////////////////////////////////

const player = new Player();
const playerTextOptions = {weight: 'bold', size: 28, family: 'PTSans', color: '#ffffff', strokeWidth: 1, strokeColor: "#ff00ff"};
const playerHPText = new TextSprite(`HP: ${player.hp}%`, 5, 5, playerTextOptions);
const playerScoreText = new TextSprite(`Scores: ${player.scores}`, VIEW.width - 5, 5, {align: "right", ...playerTextOptions});
playerScoreText.resizingScreen = function() {this.x = VIEW.width - 5;};
VIEW_DEPENDS_OBJECTS_ARR.push(playerScoreText);
const playerTextsArr = [playerHPText, playerScoreText];

let explosionsArr = [];

let enemiesArr = [];
let maxEnemies = 2;
let addEnemyStep = 0.1;
function addEnemy() {
    const type = Math.ceil(maxEnemies * Math.random());
    switch( type ) {
        case  4: enemiesArr.push(new Enemy2()); break; // наводящийся враг
        case  5:
        case  6: enemiesArr.push(new Enemy3()); break; // бонусный враг
        case  7:
        case  8: enemiesArr.push(new Enemy4()); break; // многозарядный враг
        case  9:
        case 10: enemiesArr.push(new Enemy5()); break; // электрический враг
        default:
            if (type > 5 && Math.random() < 0.5) enemiesArr.push(new Enemy4()); // многозарядный враг 
            else enemiesArr.push(new Enemy1()); // обычный враг
    }
}

let enemiesBulletsArr = [];

/** 
 * ГЛАВНЫЙ ИГРОВОЙ ЦИКЛ (вызывается из файла render.js после загрузки игры)
 * здесь описываются все игровые изменения при обновлении экрана 
 * (dt - время в миллисекундах между обновлениями экрана)
 */
function gameLoop(dt) {
    // обновляем фоны тайлов
    bgTilesArr.forEach( bgTile => bgTile.update(dt) );

    // обновляем вспышки звезд
    starsArr.forEach( star => star.update(dt) );
    starsArr = starsArr.filter(object => object.isExist);
    if (!starsArr.length && Math.random() < starProbability) addStar();

    // обновляем фоновые элементы космоса
    bgSpaceObjectsArr.forEach( bgSpaceObject => bgSpaceObject.update(dt) );
    bgSpaceObjectsArr[0].imageAngle -= 0.001;

    // обновляем фоновые планеты
    bgPlanetsArr.forEach( bgPlanet => bgPlanet.update(dt) );

    // обновляем игровые объекты
    /*
    ИГРОК, ВРАГИ, ПУЛИ, АСТЕРОИДЫ и т.п.
    */
    enemiesBulletsArr.forEach( enemyBullet => enemyBullet.update(dt) );
    enemiesBulletsArr = enemiesBulletsArr.filter(object => object.isExist);

    enemiesArr.forEach( enemy => enemy.update(dt) );
    enemiesArr = enemiesArr.filter(object => object.isExist);
    if (enemiesArr.length < maxEnemies) addEnemy();

    if (player.hp > 0) player.update(dt);

    explosionsArr.forEach( explosion => explosion.update(dt) );
    explosionsArr = explosionsArr.filter(object => object.isExist);
    ///////////////////////////////////////////////////////////

    // обновляем текст
    messagesArr.forEach( message => message.update(dt) );
    messagesArr = messagesArr.filter(object => object.isExist);
    //if (!messagesArr.length) addMessage();

    // обновляем курсор
    gameCursor.update(dt);

    // Обновление игровой информации
    playerTextsArr.forEach(text => text.draw());

    // регулировка громкости фоновой музыки
    if (KEY.left && BG_MUSIC.volume >= 0.005) BG_MUSIC.volume -= 0.005;
    if (KEY.right && BG_MUSIC.volume < 1 - 0.005) BG_MUSIC.volume += 0.005;
}
// ЗАПУСК ИГРЫ (render.js)
startGameRender();