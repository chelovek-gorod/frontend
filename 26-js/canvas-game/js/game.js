'use strict';

/*
**  ОПИСАНИЕ СУЩЕСТВУЮЩИХ ЭЛЕМЕНТОВ
**  константы, функции и классы
*/

// ИЗОБРАЖЕНИЯ и ЗВУКОВЫЕ ЭФФЕКТЫ
// IMG['file_name.png'];
// SE['file_name.mp3'];

// УПРАВЛЕНИЕ
// KEY.space (true / false);
// CURSOR.isOnClick (true / false);
// CURSOR.x, CURSOR.y;

// КОНСТАНТЫ
// const _2PI = Math.PI * 2;
// const _RAD = Math.PI / 180;

// ФУНКЦИИ
// getExistsObjectsFromArr(objectsArray) (удаляем object, если: object.isExist = false)
// turnTo( object, target, turnSpeed )
// getDistance(object, target) -> возвращает расстояние в пикселях между object и target
// moveTo( object, target, speed )
// playSound( soundName )

// КЛАССЫ

// class Text(text = '', x = 0, y = 0, size = 12, color = '#00ff00')
// this.render(text);
// this.draw();

// class Sprite(imageName, x, y)
// this.draw()

// class SpriteSheet(imageName, x, y, fw, fh, frames, fps = 60)
// this.drawWithAnimation(dt) | this.draw()

// ИГРОВОЙ ЦИКЛ
// gameLoop( deltaTime )

/****************************/

// Движущееся фоновое изображение
class ScrollBackground {
    constructor (imageName, w, h, scrollSpeed) {
        this.img = IMG[imageName];
        this.x = Math.floor((vw -  w) / 2) ;
        this.y1 = -h;
        this.y2 = 0;
        this.h = h;
        this.scrollSpeed = scrollSpeed;
    }

    update(dt) {
        let speed = this.scrollSpeed * dt;
        this.y1 += speed;
        this.y2 += speed;
        if (this.y2 >= this.h) {
            this.y1 = -this.h;
            this.y2 = 0;
        }
        ctx.drawImage(this.img, this.x, this.y1);
        ctx.drawImage(this.img, this.x, this.y2);
    }
}

// Дополнительное движущееся фоновое изображение
class ScrollSubBackground extends Sprite {
    constructor(imageName, position, y, scrollSize, scrollSpeed) {
        // class Sprite(imageName, x, y)
        super(imageName, vcx, y);
        if (position === 'left') this.x = this.hw;
        if (position === 'right') this.x = vw - this.hw;
        if (position === 'center-left') this.x = Math.floor(vw / 3);
        if (position === 'center-right') this.x = Math.ceil((vw / 3) * 2);
        this.scrollSize = scrollSize;
        this.scrollSpeed = scrollSpeed;
    }

    update(dt) {
        this.y += this.scrollSpeed * dt;
        if (this.y > this.scrollSize) this.y = -this.h;
        if (this.y+this.hh > 0 && this.y-this.hh < vh) this.draw();
    }
}

// Игровой курсор
class GameCursor extends SpriteSheet {
    constructor() {
        // class SpriteSheet(imageName, x, y, fw, fh, frames, fps = 60)
        super('player_cursor_48x48px_16frames.png', vcx, vcy, 48, 48, 16, 15);
    }

    update(dt) {
        this.x = CURSOR.x;
        this.y = CURSOR.y;
        this.drawWithAnimation(dt);
    }
}

// ФОНЫ
//               class ScrollBackground(imageName, w, h, scrollSpeed)
const background = new ScrollBackground('scrolling_bg_2000x3400px.png', 2000, 3400, 0.01);
//                    class ScrollSubBackground(imageName, position, y, scrollSize, scrollSpeed)
const subBackground1  = new ScrollSubBackground('galaxy_1200x800px.png', 'center', 0, 2400, 0.015);
const subBackground21 = new ScrollSubBackground('galaxy_480x420px.png', 'left', 1600, 3200, 0.02);
const subBackground22 = new ScrollSubBackground('galaxy_480x420px.png', 'right', 3200, 3200, 0.02);
const subBackground31 = new ScrollSubBackground('planets_920x760px.png', 'center-right', 2400, 4800, 0.025);
const subBackground32 = new ScrollSubBackground('planets_920x760px.png', 'center-left', 4800, 4800, 0.025);
const subBackground41 = new ScrollSubBackground('black_hole_left_320x320px.png', 'left', 3000, 6000, 0.03);
const subBackground42 = new ScrollSubBackground('black_hole_right_320x320px.png', 'right', 6000, 6000, 0.03);

// ИГРОВОЙ КУРСОР
//               class GameCursor()
const gameCursor = new GameCursor();

// ИГРОВОЙ ЦИКЛ
function gameLoop(dt) {
    // обновляем основной фон и дополнительные фоны
    background.update(dt);
    subBackground1.update(dt);
    subBackground21.update(dt);
    subBackground22.update(dt);
    subBackground31.update(dt);
    subBackground32.update(dt);
    subBackground41.update(dt);
    subBackground42.update(dt);

    // обновляем игровые объекты
    gameCursor.update(dt);
}