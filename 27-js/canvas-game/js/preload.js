'use strict';

/*****************
 * 
 *   ЗАГРУЗЧИК
 */

const SOUNDS_PATH = './src/sounds/';
const IMAGES_PATH = './src/images/';

const SOUNDS_UPLOAD_ARR = [
    'se_start.mp3',
    'se_brick.mp3',
    'se_platform.mp3',
    'se_bonus.mp3',
    'se_bonus_balls.mp3',
    'se_bonus_slow.mp3',
    'se_bonus_speed.mp3',
    'se_bonus_power.mp3',
    'se_win.mp3',
    'se_lose.mp3',
];

const IMAGES_UPLOAD_ARR = [
    'bg.jpg',
    'ball.png',
    'platform.png',
    'block-64x32-6f.png',
    'block-bonus-64x32-64f.png',
    'bonus_balls.png',
    'bonus_slow.png',
    'bonus_speed.png',
    'bonus_power.png',
];

let uploadSize = SOUNDS_UPLOAD_ARR.length + IMAGES_UPLOAD_ARR.length;
let loadingStep = 100 / uploadSize;
let loadingProgress = 0;

const SE = {/* sound effects */};
function uploadSound(sound_name) {
    SE[sound_name] = new Audio();
    SE[sound_name].src = SOUNDS_PATH + sound_name;
    SE[sound_name].oncanplaythrough = (event) => {
        event.target.oncanplaythrough = null;
        updateLoadingProgress();
    };
}

const IMG = {/* game images */};
function uploadImage(image_name) {
    IMG[image_name] = new Image();
    IMG[image_name].src = IMAGES_PATH + image_name;
    IMG[image_name].onload = () => updateLoadingProgress();
}

function updateLoadingProgress() {
    uploadSize--;
    loadingProgress += loadingStep;
    loadingStatusText.innerText = 'Loading ' + loadingProgress.toFixed() + ' %';
    loadingStatusLine.style.width = loadingProgress.toFixed() + '%';
    if (uploadSize < 1) loadingDone();
}

const SOUNDS_ARR = [];
const IMAGES_ARR = [];

IMAGES_UPLOAD_ARR.forEach( data => uploadImage(data) );
SOUNDS_UPLOAD_ARR.forEach( data => uploadSound(data) );

const loadingStatusBar = document.createElement('div');
loadingStatusBar.id = 'loadingStatusBar';

const loadingStatusText = document.createElement('div');
loadingStatusText.id = 'loadingStatusText';
loadingStatusText.innerText = 'Loading 0 %';

const loadingStatusLine = document.createElement('div');
loadingStatusLine.id = 'loadingStatusLine';

loadingStatusBar.prepend(loadingStatusLine);
loadingStatusBar.prepend(loadingStatusText);
document.body.prepend(loadingStatusBar);

function loadingDone() {
    loadingStatusBar.remove();

    const loadingReadyButton = document.createElement('button');
    loadingReadyButton.id = 'loadingReadyButton';
    loadingReadyButton.innerText = 'START';
    loadingReadyButton.onclick = () => {
        loadingReadyButton.remove();
        userPushStart();
    };
    document.body.prepend(loadingReadyButton);
}
