'use strict';

const MAIN_DIV = document.querySelector('main');
const RESULT = document.getElementById('result');
const POPUP_CONTAINER = document.getElementById('popup-container');
const POPUP_RESULT = document.getElementById('popup-result');
const POPUP_LABEL = POPUP_CONTAINER.querySelector('label');
const POPUP_INPUT = document.getElementById('input-name');
const POPUP_BUTTON = document.getElementById('done-button');

// {time: resultTime, name: userName}
let bestResultObjectData = null;

let bestData = localStorage.getItem('best');
if (bestData) {
    bestResultObjectData = JSON.parse( bestData );
    RESULT.innerText = `${bestResultObjectData.name} set a record of ${bestResultObjectData.time} seconds`;
}

POPUP_BUTTON.onclick = function() {
    if (!bestResultObjectData || currentTime < bestResultObjectData.time) {
        RESULT.innerText = `New record is ${currentTime} seconds`;
        bestResultObjectData = {name: POPUP_INPUT.value, time: currentTime};
        localStorage.clear();
        localStorage.setItem('best', JSON.stringify(bestResultObjectData));
    }
    location.reload();
}

const START_OPEN_IMAGE_TIMEOUT = 300;
const SHOW_OPEN_IMAGE_TIMEOUT = 900;
const SHOW_IMAGES_AT_START_TIMEOUT = 3000;

let currentTime = 0;
let isOnGame = false;

let firstOpen, secondOpen;
firstOpen = secondOpen = true; // for disable click at start

let imagesPath = './src/images/';
let imagesArr = [
    'img_001.png',
    'img_002.png',
    'img_003.png',
    'img_004.png',
    'img_005.png',
    'img_006.png',
    'img_007.png',
    'img_008.png',
    'img_009.png',
    'img_010.png',
    'img_011.png',
    'img_012.png'
];
let pairForWin = imagesArr.length;

const MAIN_DIV_WIDTH = MAIN_DIV.offsetWidth;
const MAIN_DIV_HEIGHT = MAIN_DIV.offsetHeight;
const MAIN_DIV_AREA = MAIN_DIV_WIDTH * MAIN_DIV_HEIGHT;
const ONE_IMAGE_AREA = MAIN_DIV_AREA / (pairForWin * 2);
const MARGINS_SPACES_SIZE = 34; // margin 12+12px and 5+5px from <main> borders
const ONE_IMAGE_SIDE = Math.floor( Math.sqrt( ONE_IMAGE_AREA ) - MARGINS_SPACES_SIZE );

const imagesPairArr = imagesArr.concat(imagesArr);
imagesPairArr.sort(()=>Math.random()-0.5);

let openImagesNumber = 0;

let imagesDivArr = [];
for (let i = 0; i < imagesPairArr.length; i++) {
    addImageInMain(imagesPairArr[i]);
}

function addImageInMain (img) {
    let imageDiv = document.createElement('div');
    let clickFunction = `clickImage(this, "${img}")`;
    imageDiv.className = 'flip-box';
    imageDiv.style.width = ONE_IMAGE_SIDE + 'px';
    imageDiv.style.height = ONE_IMAGE_SIDE + 'px';
    imageDiv.setAttribute('onclick', clickFunction);
    imageDiv.innerHTML = `
        <div class='flip-inner'>
            <div class='flip-inner-logo'>
                <img src=${imagesPath + 'logo.svg'} alt=${'logo-' + img}>
            </div>
            <div class='flip-inner-image'>
                <img class='image' src=${imagesPath + img} alt=${'image-' + img}>
            </div>
        </div>
        `;
    MAIN_DIV.append(imageDiv);
    imagesDivArr.push(imageDiv);
}

setTimeout(startOpenImage, START_OPEN_IMAGE_TIMEOUT, 0);

function startOpenImage(index) {
    if (index < imagesDivArr.length) {
        imagesDivArr[index].classList.toggle('open');
        setTimeout(startOpenImage, START_OPEN_IMAGE_TIMEOUT, index + 1);
    } else {
        setTimeout(startGame, SHOW_IMAGES_AT_START_TIMEOUT);
    }
}

function startGame() {
    imagesDivArr.forEach(div => div.classList.toggle('open'));
    firstOpen = secondOpen = undefined; // for click listening
    isOnGame = true;
    RESULT.innerHTML = `Play time: ${currentTime} seconds`;
    setTimeout(countSeconds, 1000);
}

function clickImage(id, image) {
    if(!firstOpen) {
        id.classList.toggle('open');
        firstOpen = {
            id: id,
            image: image
        };
    }

    if(!secondOpen && firstOpen.id !== id){
        id.classList.toggle('open');
        secondOpen = true;
        testOpenPair(id, image);
    }
}

function testOpenPair(id, image) {
    if (image === firstOpen.image) {
        id.removeAttribute('onclick');
        firstOpen.id.removeAttribute('onclick');

        openImagesNumber++;
        if (openImagesNumber === pairForWin) {
            isOnGame = false;
            POPUP_RESULT.innerText = currentTime;
            POPUP_CONTAINER.style.display = 'flex';
            if (bestResultObjectData) {
                if (currentTime >= bestResultObjectData.time) {
                    POPUP_LABEL.style.display = 'none';
                    POPUP_INPUT.style.display = 'none';
                } else {
                    POPUP_INPUT.value = bestResultObjectData.name;
                }
            }
            setTimeout( ()=> POPUP_CONTAINER.style.opacity = 1, 0 );
        } 
        else firstOpen = secondOpen = undefined;
    } else {
        setTimeout(closeWrongImages, SHOW_OPEN_IMAGE_TIMEOUT, id);
    }
}

function closeWrongImages(id) {
    id.classList.toggle('open');
    firstOpen.id.classList.toggle('open')
    firstOpen = secondOpen = undefined;
}

function countSeconds() {
    if (isOnGame) {
        currentTime++;
        RESULT.innerHTML = `Play time: ${currentTime} seconds`;
        setTimeout(countSeconds, 1000);
    }
}
