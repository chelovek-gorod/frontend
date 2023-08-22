'use strict';

/*
**  ЗАГРУЗКА ИГРОВЫХ РЕСУРСОВ
*/

/**
 * Объект для хранения загруженных изображений IMG = {'image.png': Image}
 * @example пример получения загруженного изображения по имени файла с изображением:
 * sprite = IMG["image.png"]
 */
const IMG = {/* game images */};
// переменная пути к изображениям
const IMAGES_PATH = './src/images/';

/**
 * Объект для хранения загруженных звуков SE = {'sound.mp3': Audio}
 * @example пример получения загруженного звука по имени аудио файла:
 * sound = SE["sound.mp3"]
 */
const SE = {/* sound effects */};
// переменная пути к звукам
const SOUNDS_PATH = './src/sounds/';

// переменная пути к JavaScript-файлам
const SCRIPTS_PATH = './js/';

// список загружаемых изображений
const imagesToUploadArray = [
    'space_bg_tile_1600x2760px.jpg',
    'space_bg_alpha_tile_1440x724px.png',

    'galaxy_480x420px.png',
    'nebula_1071x1328px.png',
    'nebula_1250x1345px.png',
    'star_94x94px.png',
    'star_106x106px.png',
    'star_dust_1184x842px.png',
    'star_dust_1316x683px.png',
    'star_dust_1388x774px.png',

    'sun_red_580x580px.png',
    'sun_yellow_552x552px.png',
    'planet_76x76px.png',
    'planet_102x102px.png',
    'planet_128x128px.png',
    'planet_154x154px.png',
    'planet_204x204px.png',
    'planet_256x256px.png',
    'space_station_598x408px.png',

    'star_flash_32x32px_11frames.png',

    'cursor_48x48px_16frames.png',

    'player_74x100px_16frames.png',
    'player_bullet_10x40px.png',
];

// список загружаемых звуков
const soundsToUploadArray = [
    'se_laser_shut_1.mp3',
    'se_laser_shut_2.mp3',
];

// список загружаемых скриптов
const scriptsToUploadArray = [
    'control.js',
    'music.js',
    'utils.js',
    'sprites.js',
    'render.js',
];

// упорядоченный список загружаемых скриптов (game.js должен загружаться самым последним)
// загрузка запускается в указанном порядке и после загрузки скриптов из массива scriptsToUploadArray
// так как в данных скриптах используются переменные, функции и классы из ранее загруженных скриптов
const orderedScriptsToUploadArray = [
    'objects.js',
    'game.js',
];

// счетчик количества загруженных игровых ресурсов
let uploadSize = soundsToUploadArray.length + imagesToUploadArray.length + scriptsToUploadArray.length;
let uploadStep = 0;

// отображения состояния загрузки игровых ресурсов
const loadingStatusDiv = document.createElement('div');
loadingStatusDiv.id = 'loadingStatusDiv';
loadingStatusDiv.innerHTML = 'Loaded files: ' + uploadStep + '/' + uploadSize;
document.body.append(loadingStatusDiv);

// загрузка игровых ресурсов
imagesToUploadArray.forEach( data => uploadImage(data) );
soundsToUploadArray.forEach( data => uploadSound(data) );
scriptsToUploadArray.forEach( data => uploadScript(data) );

// функция загрузки изображений
function uploadImage(image_name) {
    IMG[image_name] = new Image();
    IMG[image_name].src = IMAGES_PATH + image_name;
    IMG[image_name].onload = () => updateLoadingProgress();
}

// функция загрузки звуков
function uploadSound(sound_name) {
    SE[sound_name] = new Audio();
    SE[sound_name].src = SOUNDS_PATH + sound_name;
    SE[sound_name].oncanplaythrough = (event) => {
        event.target.oncanplaythrough = null; // не запускать звук после его загрузки
        updateLoadingProgress();
    };
}

// функция загрузки скриптов
function uploadScript(script_name) {
    const script = document.createElement('script');
    script.src = SCRIPTS_PATH + script_name;
    document.body.append(script);
    script.onload = () => updateLoadingProgress();
}

// функция обновления отображаемого состояния загрузки игровых ресурсов
function updateLoadingProgress() {
    uploadStep++;
    loadingStatusDiv.innerHTML = 'Загружено: ' + uploadStep + '/' + uploadSize;
    if (uploadStep === uploadSize) loadingDone();
}

// функция окончания загрузки всех игровых ресурсов
function loadingDone() {
    loadingStatusDiv.remove();
    const startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.innerHTML = 'START';
    startButton.onclick = function() {
        startButton.remove();
        orderedUploadScripts(orderedScriptsToUploadArray);
    };
    document.body.append(startButton);
}

// функция упорядоченной загрузки скриптов
function orderedUploadScripts(scripts) {
    const script = document.createElement('script');
    script.src = SCRIPTS_PATH + scripts[0];
    document.body.append(script);
    if (scripts.length > 1) script.onload = () => orderedUploadScripts(scripts.slice(1));
}