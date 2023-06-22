'use strict';

/*
**  ОПИСАНИЕ СУЩЕСТВУЮЩИХ ЭЛЕМЕНТОВ
**  константы, функции и классы
*/

// CANVAS
// vw - ширина окна, vcx - центр по ширине окна;
// vh - высота окна, vcy - центр по высоте окна;
// ctx - контекст для отрисовки.

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

// Корабль игрока
class Player extends SpriteSheet {
    constructor() {
        // class SpriteSheet (imageName, x, y, fw, fh, frames, fps = 60)
        super('player_74x100px_16frames.png', vcx, vcy * 1.5, 74, 100, 16, 30);

        this.speed = 0.1;
        this.size = 35;
        this.hp = 100;
        this.scores = 0;

        this.shutSpeed = 1200;
        this.nextShutTimeout = this.shutSpeed;
        this.bulletSpeed = 0.5;
        this.bulletsArr = [];
    }

    update(dt) {
        moveTo( this, CURSOR, this.speed * dt );

        // перезарядка
        this.nextShutTimeout -= dt;
        if (this.nextShutTimeout <= 0) {
            this.nextShutTimeout += this.shutSpeed;
            //                  class PlayerBullet(x, y, speed)
            this.bulletsArr.push( new PlayerBullet(this.x, this.y, this.bulletSpeed) );
        }

        // обновление пуль
        for (let i = 0; i < this.bulletsArr.length; i++) {
            this.bulletsArr[i].update(dt);
        }
        this.bulletsArr = getExistsObjectsFromArr(this.bulletsArr);
    
        this.drawWithAnimation(dt);
    }

    setScores(scores) {
        player.scores += scores;
        PLAYER_SCORES_TEXT.render(`SCORES: ${player.scores}`);
    }

    setDamage( damageSize ) {
        this.hp -= damageSize;
        if (this.hp < 1) {
            this.hp = 0;
            this.y = -vh; // чтобы не риагировать на столкновения с астеройдами и врагами
            this.bulletsArr = [];
            //                class Explosion(x, y)
            explosionsArr.push( new Explosion(this.x, this.y));
        }
        PLAYER_HP_TEXT.render(`HP: ${this.hp}%`);
    }
}

// Пули игрока
class PlayerBullet extends Sprite {
    constructor(x, y, speed) {
        // class Sprite (imageName, x, y)
        super('player_bullet_10x40px.png', x, y);
        this.speed = speed;
        this.isExist = true;

        playSound('se_laser_shut.mp3');
    }

    update(dt) {
        this.y -= this.speed * dt;
        if (this.y < -this.h) this.isExist = false;
        else this.draw();
    }
}

// Взрывы
class Explosion extends SpriteSheet {
    constructor(x, y) {
        // class SpriteSheet (imageName, x, y, fw, fh, frames, fps = 60)
        super('explosion_200x200px_16frames.png', x, y, 200, 200, 16, 30);
        this.isExist = true;

        playSound( 'se_explosion.mp3' );
    }

    update(dt) {
        this.drawWithAnimation(dt);
        if (this.frame === this.frames - 1) this.isExist = false;
    }
}

// Астеройды
class Asteroid extends SpriteSheet {
    constructor(x, y, speed) {
        // class SpriteSheet (imageName, x, y, fw, fh, frames, fps = 60)
        super('asteroid_white_90x108px_29frames.png', x, y, 90, 108, 29, 30);
        this.rotationSpeed = speed / 50;
        this.speed = speed;
        this.hp = 3;
        this.size = 45;
        this.damage = 25;
        this.isExist = true;
    }

    update(dt) {
        this.direction += this.rotationSpeed * dt;
        this.y += this.speed * dt;
        // проверка вылета за экран
        if (this.y - this.hh > vh) {
            this.isExist = false;
            return;
        }

        // проверка столкновений с пулями игрока
        for (let i = 0; i < player.bulletsArr.length; i++) {
            if (getDistance(this, player.bulletsArr[i]) < this.size) {
                player.bulletsArr[i].isExist = false;
                this.hp--;
                player.setScores(1);
                if (this.hp < 1) {
                    player.setScores(10);
                    this.destroyed(true);
                    return;
                }
            }
        }

        // проверка столкновения с игроком 
        if (getDistance(this, player) < this.size + player.size) {
            player.setDamage(this.damage);
            this.destroyed(false);
            return;
        }

        this.drawWithAnimation(dt)
    }

    // уничтожение астеройда
    destroyed( isToAddRocks ) {
        if (isToAddRocks) {
            //                                      class Rock(x, y, speed, direction)
            for(let i = 1; i < 5; i++) rocksArr.push( new Rock(this.x, this.y, this.speed * 1.5, i));
        }
        maxAsteroids += 0.2;
        //                class Explosion(x, y)
        explosionsArr.push( new Explosion(this.x, this.y));
        this.isExist = false;
    }
}

// Камни (от астеройдов)
class Rock extends SpriteSheet {
    constructor(x, y, speed, direction) {
        // class SpriteSheet(imageName, x, y, fw, fh, frames, fps = 60)
        super('rock_white_50x50px_8frames.png', x, y, 50, 50, 8, 15);
        this.speed = speed;
        this.target = this.getDirection(direction);
        this.size = 24;
        this.damage = 5;
        this.isExist = true;
    }

    // определения направления движения камня
    getDirection(direction) {
        let xx, yy;
        switch(direction) {
            case 1 : // летит вверх
                xx = -this.hw + Math.floor(Math.random() * (vw + 25));
                yy = -this.hh;
            break;

            case 2 : // летит в право
                xx = vw + this.hw;
                yy = -this.hh + Math.floor(Math.random() * (vh + 25));
            break;

            case 3 : // летин вниз
                xx = -this.hw + Math.floor(Math.random() * (vw + 25));
                yy = vh + this.hh;
            break;

            default: // летит в лево
                xx = -this.hw;
                yy = -this.hh + Math.floor(Math.random() * (vh + 25));
        }
        return {x: xx, y: yy};
    }

    update(dt) {
        moveTo( this, this.target, this.speed * dt );

        // проверка вылета за экран
        if (this.x + this.hw < 0 || this.x - this.hw > vw || this.y + this.hh < 0 || this.y - this.hh > vh) {
            this.isExist = false;
            return;
        }

        // проверка столкновений с пулями игрока
        for (let i = 0; i < player.bulletsArr.length; i++) {
            if (getDistance(this, player.bulletsArr[i]) < this.size) {
                player.bulletsArr[i].isExist = false;
                player.setScores(5);
                this.destroyed();
                return;
            }
        }

        // проверка столкновения с игроком
        if (getDistance(this, player) < this.size + player.size) {
            player.setDamage(this.damage);
            this.destroyed();
            return;
        }

        this.drawWithAnimation(dt)
    }

    // уничтожение камня
    destroyed() {
        //                class Explosion(x, y)
        explosionsArr.push( new Explosion(this.x, this.y));
        this.isExist = false;
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

// КОРАБЛЬ ИГРОКА
//           class Player()
const player = new Player();

// ТЕКСТОВЫЕ ОБЪЕКТЫ (жизни и очки игрока, а так же текст проигрыша)
//                   class Text(text = '', x = 0, y = 0, size = 12, color = '#00ff00')
const PLAYER_HP_TEXT = new Text(`HP: ${player.hp}%`, 10, 10, 24, '#ffffff');
const PLAYER_SCORES_TEXT = new Text(`SCORES: ${player.scores}`, vw - 180, 10, 24, '#ffffff');

const GAME_OVER_TEXT = new Text('GAME OVER', vcx - 160, vcy - 30, 60, '#ff0000');

// массив взрывов
let explosionsArr = [];

// массивы астеройдов, камней и максимальное число астеройдов при старте игры
let maxAsteroids = 2;
let asteroidsArr = [];
let rocksArr = [];

// функция добавления нового астеройда
function addAsteroids() {
    let xx = 50 + Math.floor(Math.random() * (vw - 100));
    let yy = -50 - Math.floor(Math.random() * vcy);
    let speed = +((Math.ceil(Math.random() * 3)) / 20).toFixed(2);
    //               class Asteroid(x, y, speed)
    asteroidsArr.push( new Asteroid(xx, yy, speed) );
}

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

    for (let i = 0; i < rocksArr.length; i++) rocksArr[i].update(dt);
    rocksArr = getExistsObjectsFromArr(rocksArr);

    for (let i = 0; i < asteroidsArr.length; i++) asteroidsArr[i].update(dt);
    asteroidsArr = getExistsObjectsFromArr(asteroidsArr);
    if (asteroidsArr.length < maxAsteroids) addAsteroids();

    if (player.hp > 0) player.update(dt);
    else GAME_OVER_TEXT.draw();

    for (let i = 0; i < explosionsArr.length; i++) explosionsArr[i].update(dt);
    explosionsArr = getExistsObjectsFromArr(explosionsArr);

    // рисуем надписи
    PLAYER_HP_TEXT.draw();
    PLAYER_SCORES_TEXT.draw();
}