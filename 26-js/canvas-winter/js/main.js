'use strict';

let imagesArr = [
    'cloud_1.png', 'cloud_2.png', 'cloud_3.png', 'cloud_4.png', 'cloud_5.png',
    'house_1.png', 'house_2.png',
    'snowflake_1.png', 'snowflake_2.png', 'snowflake_3.png', 'snowflake_4.png', 'snowflake_5.png', 'snowflake_6.png', 'snowflake_7.png',
    'snowman_1.png', 'snowman_2.png', 'snowman_3.png',
    'tree_1.png', 'tree_2.png', 'tree_3.png', 'tree_4.png',
];

let loadedImages = 0;

let IMG = {/* imageName */}

imagesArr.forEach( loadImage );

function loadImage(imageName) {
    let img = new Image();
    img.src = './src/images/' + imageName;
    img.onload = imageUploaded;
    IMG[imageName] = img;
}

function imageUploaded() {
    loadedImages++;
    if (loadedImages === imagesArr.length) {
        requestAnimationFrame( animation );
    }
}

let cloudsArr= [
    {img: IMG['cloud_1.png'], x:  10, y: 10, speed: 0.02},
    {img: IMG['cloud_2.png'], x: 280, y: 10, speed: 0.025},
    {img: IMG['cloud_3.png'], x: 580, y: 10, speed: 0.03},
];

let snowflakesArr= [];

for (let i = 0; i < 300; i++) {
    let xx = Math.random() * 800;
    let yy = Math.random() * 600;
    let img = IMG['snowflake_' + Math.ceil(Math.random() * 7) + '.png'];
    let speed = 0.01 + Math.random() / 100;
    snowflakesArr.push({img: img, x: xx, y: yy, speed: speed});
}

const canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');

let timeStamp = performance.now();
function animation( time ) {
    let deltaTime = time - timeStamp;
    timeStamp = time;

    ctx.clearRect(0, 0, 800, 600);

    cloudsArr.forEach( cloud => {
        cloud.x += cloud.speed * deltaTime;
        if (cloud.x > 800) cloud.x = -cloud.img.width;
        ctx.drawImage(cloud.img, cloud.x, cloud.y);
    });

    ctx.drawImage(IMG['tree_1.png'], 280, 210);
    ctx.drawImage(IMG['house_1.png'], 50, 250);
    ctx.drawImage(IMG['snowman_1.png'], 350, 420, 90, 120);
    ctx.drawImage(IMG['tree_3.png'], -20, 200);
    ctx.drawImage(IMG['tree_2.png'], 500, 200);

    snowflakesArr.forEach( snowflake => {
        snowflake.y += snowflake.speed * deltaTime;
        if (snowflake.y > 600) snowflake.y  = -snowflake.img.height;
        ctx.drawImage(snowflake.img, snowflake.x, snowflake.y);
    });

    requestAnimationFrame( animation );
}