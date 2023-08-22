'use strict';

/*
**  КЛАССЫ (и миксины) ИГРОВЫХ ОБЪЕКТОВ
*/

class ScreenSaver {
    constructor() {
        this.img = IMG['algoritmika_space_game_512x282px.png'];
        this.width = (VIEW.width > 512) ? 512 : 256;
        this.height = (VIEW.width > 512) ? 282 : 141;
        this.x = (VIEW.width / 2) - (this.width / 2);
        this.y = (VIEW.height / 2) - (this.height / 2);
        this.visibleTime = 1500;
        this.exitTime = 2500;
        this.alpha = 1;
        this.alphaStep = 1 / this.exitTime;
    }

    update(dt) {
        if (this.visibleTime > 0) this.visibleTime -= dt;
        else this.alpha -= this.alphaStep * dt;
        if (this.alpha <= 0) return;
    
        if (this.alpha === 1) CONTEXT.drawImage(this.img, this.x, this.y, this.width, this.height);
        else {
            CONTEXT.save();
            CONTEXT.globalAlpha = this.alpha;
            CONTEXT.drawImage(this.img, this.x, this.y, this.width, this.height);
            CONTEXT.restore();
        }
    }
}

// Игровой курсор
class GameCursor extends SpriteSheet {
    constructor() {
        // вызываем конструктор родительского класса анимированного спрайта SpriteSheet
        // изображение, x, y, ширина кадра, высота кадра, число кадров, частота обновления
        super('cursor_48x48px_16frames.png', VIEW.x, VIEW.y, 48, 48, 16, 15);
    }

    // при каждом обновлении экрана будем переносить наш курсор к указателю мыши или точки касания экрана
    update(dt) {
        this.x = CURSOR.x;
        this.y = CURSOR.y;
        this.drawWithAnimation(dt);
    }
}

// Движущееся фоновое изображение из тайлов
class ScrollingBackground extends TileSprite {
    constructor (imageName, scrollSpeed) {
        // вызываем конструктор родительского класса тайлового спрайта TileSprite
        // изображение, x, y, ширина кадра, высота кадра, число кадров, частота обновления
        super(imageName, VIEW.x, VIEW.y, VIEW.width, VIEW.height + IMG[imageName].height, 'center', 'center');
        this.tileHeight = IMG[imageName].height; 
        this.y -= Math.floor(this.tileHeight / 2);
        this.restartPointY = this.y + this.tileHeight;
        this.scrollSpeed = scrollSpeed;
        VIEW_DEPENDS_OBJECTS_ARR.push(this); // добавляем в список объектов, зависимых от размеров экрана
    }

    // вызывается при изменении размеров экрана из render.js
    resizingScreen() {
        // заменяем тайл на новый, с размерами под новое разрешение экрана
        const previousImageName = this.img.imageName;
        const newTileHeight = VIEW.height + IMG[this.tileName].height;
        const tile = IMG[this.tileName];

        let offsetX, offsetY;
        if (VIEW.width > tile.width) offsetX = -Math.floor( (tile.width - (VIEW.width % tile.width)) / 2 );
        if (VIEW.width < tile.width) offsetX = -Math.floor( (tile.width - VIEW.width) / 2 );
    
        if (newTileHeight > tile.height) offsetY = -Math.floor( (tile.height - (newTileHeight % tile.height)) / 2 );
        if (newTileHeight < tile.height) offsetY = -Math.floor( (tile.height - newTileHeight) / 2 );
    
        const img = document.createElement('canvas');
        img.width = VIEW.width;
        img.height = newTileHeight;
        const imgContext = img.getContext('2d');
    
        for( let yy = offsetY; yy < newTileHeight; yy += tile.height) {
            for( let xx = offsetX; xx < VIEW.width; xx += tile.width) {
                imgContext.drawImage(tile, xx, yy);
            }
        }
    
        img.imageName = `tile_${VIEW.width}x${newTileHeight}px_center_center_from_${this.tileName}`;
        IMG[img.imageName] = img;
        this.img = img;

        delete IMG[previousImageName];
    }

    // при каждом обновлении экрана двигаем фон с заданной скоростью, если пролистали весь - возвращаем в начало
    update(dt) {
        this.y += this.scrollSpeed * dt;
        if (this.y >= this.restartPointY) this.y -= this.tileHeight;
        this.draw();
    }
}

// Фоновый спрайт
class BackgroundSprite extends Sprite {
    constructor (imageName, scrollSpeed, periodicity) {
        // вызываем конструктор родительского класса спрайта Sprite
        //     изображение, x, y,
        super(imageName, Math.floor(Math.random() * VIEW.width), 0);
        this.scrollSpeed = scrollSpeed;
        this.periodicity = periodicity;
        this.startPointY = -(scrollSpeed * periodicity);
        this.restartPointY = VIEW.height + this.halfHeight;
        this.y = VIEW.height - (VIEW.height + -this.startPointY) * Math.random();
        VIEW_DEPENDS_OBJECTS_ARR.push(this); // добавляем в список объектов, зависимых от размеров экрана
    }

    // вызывается при изменении размеров экрана из render.js
    resizingScreen() {
        this.restartPointY = VIEW.height + this.halfHeight;
        this.startPointY = -(this.scrollSpeed * this.periodicity);
    }

    // при каждом обновлении экрана двигаем с заданной скоростью, если ушло за экран - возвращаем в начало
    update(dt) {
        this.y += this.scrollSpeed * dt;
        if (this.y >= this.restartPointY) {
            this.x = Math.floor(Math.random() * VIEW.width);
            this.y = this.startPointY;
        }
        if (checkObjectVisibility(this)) this.draw(); // рисуем, если в зоне видимости
    }
}

// Анимированный объект с разовым циклом анимации (взрывы, дым и т.п.)
class OneLoopSpriteSheet extends SpriteSheet {
    constructor(imageName, x, y, frameWidth, frameHeight, frames, fps = 60) {
        // вызываем конструктор родительского класса анимированного спрайта SpriteSheet
        // изображение, x, y, ширина кадра, высота кадра, число кадров, частота обновления, угол поворота изображения
        super(imageName, x, y, frameWidth, frameHeight, frames, fps, Math.random() * _2PI);
    }

    // рисуем с анимацией при каждом обновлении экрана
    // если дошли до последнего кадра - переключаем поле isExist в false (для фильтровки ненужных спрайтов)
    update(dt) {
        if (this.frame === this.frames - 1) this.isExist = false;
        else this.drawWithAnimation(dt);
    }
}

// Текст для очков со свечением и плавным исчезновением
class MessageText extends TextSprite {
    constructor(text, x, y) {
        // вызываем конструктор родительского класса текстового спрайта TextSprite
        // текст, x, y, объект опций
        super(text, x, y, {weight: 'bold', size: 20, family: 'PTSans', fillColor: '#ffff00', align: 'center'});
        this.shadowColor = '#ff00ff'; // цвет свечения
        this.hideTime = 2000; // время, сколько текст будет исчезать (в миллисекундах)
        this.visibleTime = 1000; // время, сколько текст будет виден (в миллисекундах)
        this.alphaStepPerMillisecond = 1 / this.hideTime; // на сколько должна изменяться прозрачность (каждую миллисекунду)
        this.speedY = 0.02;
        this.alpha = 1; // начальное значение прозрачности (1 - полностью не прозрачный, 0 - полностью прозрачный)
    }

    // отрисовка движущегося вверх текста, с плавным исчезновением
    // если дошли до alpha = 0 - переключаем поле isExist в false (для фильтровки ненужных спрайтов)
    update(dt) {
        this.y -= this.speedY * dt;

        if (this.alpha === 1) {
            this.visibleTime -= dt;
            if (this.visibleTime <= 0) this.alpha -= this.alphaStepPerMillisecond * dt;
        } else {
            this.alpha -= this.alphaStepPerMillisecond * dt;
        }

        if (this.alpha <= 0) {
            this.isExist = false;
            return;
        }

        // создание свечения и прозрачности
        CONTEXT.save(); // сохраняем контекст (чтобы эффекты прозрачности и свечения не влияли на другие спрайты)
        if (this.alpha < 1) CONTEXT.globalAlpha = this.alpha;
        CONTEXT.shadowBlur  = 5; // задаем размытие свечению
        CONTEXT.shadowColor = this.shadowColor; // задаем цвет свечения
        CONTEXT.globalCompositeOperation = 'lighter'; // указываем тип свечения
        this.draw();
        CONTEXT.restore(); // восстанавливаем контекст в начальное состояние (до вызова метода CONTEXT.save())
    }
}

//////////////////////

class Player extends SpriteSheet {
    constructor() {
        super('player_74x100px_16frames.png', VIEW.x, VIEW.height + 100, 74, 100, 16, 30);
        this.speed = 0.12;
        this.hp = 100;
        this.scores = 0;

        this.bulletsArr = [];
        this.bulletReloadSpeed = 2000;
        this.bulletReloadTimeout = this.bulletReloadSpeed;
    }

    update(dt) {
        // перемещаемся к курсору
        moveObjectToTarget(this, CURSOR, this.speed * dt);

        // перезарядка и стрельба пулями
        this.bulletReloadTimeout -= dt;
        if (this.bulletReloadTimeout <= 0) {
            this.bulletReloadTimeout += this.bulletReloadSpeed;
            this.bulletsArr.push( new PlayerBullet(this.x, this.y));
        }
        this.bulletsArr = this.bulletsArr.filter(object => object.isExist);
        this.bulletsArr.forEach( bullet => bullet.update(dt) );

        this.drawWithAnimation(dt);
    }

    addDamage(damage) {
        this.hp -= damage;
        if (this.hp > 0) playerHPText.render(`HP: ${this.hp}%`);
        else this.destroy();
        
    }

    addScores(scores, x, y) {
        if (this.hp < 0) return;
        messagesArr.push( new MessageText(`+${scores}`, x, y) )
        this.scores += scores;
        playerScoreText.render(`Scores: ${this.scores}`)
    }

    destroy() {
        playerHPText.render(`HP: ${0}%`);
        explosionsArr.push(new Explosion(this.x, this.y, 5));
        this.y = VIEW.height * 2;
        playBgMusic(['bgm_game_over.mp3'], 0);   
    }
}

class PlayerBullet extends Sprite {
    constructor(x, y) {
        super('player_bullet_10x40px.png', x, y);
        this.speed = 0.5;
        this.damage = 1;

        playSound('se_laser_shut_1.mp3');
    }

    update(dt) {
        this.y -= this.speed * dt;
        if (this.y < -this.halfHeight) this.isExist = false;
        else this.draw();
    }
}

class Explosion extends OneLoopSpriteSheet {
    constructor(x, y, type = 0) {
        switch(type) {
            case 1 : super('explosion_64x64px_17frames.png', x, y, 64, 64, 17, 30); playSound('se_hit.mp3'); break;
            case 2 : super('explosion_192x192px_25frames.png', x, y, 192, 192, 25, 30); playSound('se_rock.mp3'); break;
            case 3 : super('explosion_240x240px_28frames.png', x, y, 240, 240, 28, 30); playSound('se_explosion_1.mp3'); break;
            case 4 : super('explosion_256x256px_48frames.png', x, y, 256, 256, 48, 30); playSound('se_explosion_1.mp3'); break;
            case 5 : super('explosion_256x256px_72frames.png', x, y, 256, 256, 72, 30); playSound('se_explosion_1.mp3'); break;
            default: super('explosion_128x128px_20frames.png', x, y, 128, 128, 20, 30); playSound('se_explosion_2.mp3'); 
        }
    }
}

const mixinAddDamage = {
    // получение урона
    addDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) this.destroy();
    }
}

const mixinDestroy = {
    destroy() {
        maxEnemies += addEnemyStep;
        this.isExist = false;
        explosionsArr.push(new Explosion(this.x, this.y, 4));
    }
}

const mixinCheckPlayerCollision = {
    // проверка столкновения с игроком
    checkPlayerCollision() {
        if (getDistance(this, player) < this.size + player.size) {
            this.destroy();
            player.addDamage(this.damage);
        }
    }
}

const mixinCheckPlayerBulletCollision = {
    // проверка столкновений с пулями игрока
    checkPlayerBulletCollision() {
        player.bulletsArr.forEach( bullet => {
            if (bullet.isExist && getDistance(this, bullet) < this.size) {
                explosionsArr.push(new Explosion(bullet.x, bullet.y, 1));
                bullet.isExist = false;
                this.addDamage(bullet.damage);
                if (this.hp > 0) player.addScores(this.hitScoresPlayerBullet, this.x, this.y);
                else player.addScores(this.destroyScoresPlayerBullet, this.x, this.y);
            }
        });
    }
}

class EnemySprite extends Sprite {
    constructor(imageName, x, y, imageAngle = 0) {
        super(imageName, x, y, imageAngle);
    }

    update(dt) {
        if (this.isExist === false) return;
        this.action(dt);
        if (this.isExist === false) return;
        this.checkPlayerBulletCollision();
        if (this.isExist === false) return;
        this.checkPlayerCollision();
        if (this.isExist === false) return;
        this.draw();
    }
}
Object.assign(EnemySprite.prototype,
    mixinAddDamage,
    mixinDestroy,
    mixinCheckPlayerBulletCollision,
    mixinCheckPlayerCollision
);

class Enemy1 extends EnemySprite { // вертикальный палет, одиночные выстрелы
    constructor() {
        super('enemy_1_52x78px.png', Math.random() * VIEW.width, -39);
        this.hp = 2;
        this.speed = 0.035;
        this.damage = 10;

        this.bulletReloadSpeed = 3500;
        this.bulletReloadTimeout = this.bulletReloadSpeed;

        this.hitScoresPlayerBullet = this.hp;
        this.destroyScoresPlayerBullet = this.hp * 5;
    }

    action(dt) {
        // движение
        this.y += this.speed * dt;
        if (this.y > this.halfHeight + VIEW.height) {
            this.isExist = false;
            return;
        }

        // стрельба
        this.bulletReloadTimeout -= dt;
        if (this.bulletReloadTimeout <= 0) {
            this.bulletReloadTimeout += this.bulletReloadSpeed;
            enemiesBulletsArr.push(new EnemyBullet(this.x, this.y));
        }
    }
}

class Enemy2 extends EnemySprite { // наводится на игрока, не стреляет
    constructor() {
        super('enemy_2_146x62px.png', Math.random() * VIEW.width, -73, Math.PI / 2);
        this.hp = 3;
        this.speed = 0.04;
        this.turnSpeed = 0.0003;
        this.damage = 20;

        this.hitScoresPlayerBullet = this.hp;
        this.destroyScoresPlayerBullet = this.hp * 5;
    }

    action(dt) {
        // движение
        turnObjectToTarget(this, player, this.turnSpeed * dt);
        moveObject(this, this.speed * dt);
        if (!checkObjectVisibility(this)) this.isExist = false;
    }
}

class Enemy3 extends EnemySprite { // летит вниз, не стреляет, везет бонусы
    constructor() {
        super('enemy_3_82x192px.png', Math.random() * VIEW.width, -96);
        this.hp = 6;
        this.speed = 0.03;
        this.damage = 15;
        this.containers = 6;

        this.hitScoresPlayerBullet = this.hp;
        this.destroyScoresPlayerBullet = this.hp * 5;
    }

    action(dt) {
        // движение
        this.y += this.speed * dt;
        if (this.y > this.halfHeight + VIEW.height) this.isExist = false;
    }

    destroy() {
        maxEnemies += addEnemyStep;
        this.isExist = false;
        explosionsArr.push(new Explosion(this.x, this.y, 4));
    }
}

class Enemy4 extends EnemySprite { // летит вниз, по горизонтали подстраивается под игрока, тройные выстрелы по две пули
    constructor() {
        super('enemy_4_100x130px.png', Math.random() * VIEW.width, -65);
        this.hp = 4;
        this.speed = 0.05;
        this.speedX = 0.01;
        this.damage = 12;

        this.shuts = 3;
        this.bullets = this.shuts;
        this.bulletShutDelay = 500;
        this.bulletShutTimeout = this.bulletShutDelay;
        this.bulletReloadSpeed = 3500;
        this.bulletReloadTimeout = this.bulletReloadSpeed;

        this.hitScoresPlayerBullet = this.hp;
        this.destroyScoresPlayerBullet = this.hp * 5;
    }

    action(dt) {
        // движение
        this.y += this.speed * dt;
        if (this.y > this.halfHeight + VIEW.height) {
            this.isExist = false;
            return;
        }
        if (this.x > player.x) this.x -= this.speedX * dt;
        else this.x += this.speedX * dt;

        // перезарядка и стрельба пулями
        if (this.bullets > 0) {
            this.bulletShutTimeout -= dt;
            if (this.bulletShutTimeout <= 0) {
                this.bullets--;
                this.bulletShutTimeout += this.bulletShutDelay;
                enemiesBulletsArr.push(new EnemyBullet(this.x - 30, this.y));
                enemiesBulletsArr.push(new EnemyBullet(this.x + 30, this.y));
            }
        } else {
            this.bulletReloadTimeout -= dt;
            if (this.bulletReloadTimeout <= 0) {
                this.bulletReloadTimeout += this.bulletReloadSpeed;
                this.bullets = this.shuts;
            }
        }
    }
}

class Enemy5 extends EnemySprite { // наводится на игрока, стреляет электричеством
    constructor() {
        super('enemy_5_186x126px.png', Math.random() * VIEW.width, -93, Math.PI / 2);
        this.hp = 5;
        this.speed = 0.045;
        this.turnSpeed = 0.0003;
        this.damage = 15;

        this.lightningDamage = 12;
        this.lightningShutDistance = 200 + this.size + player.size;
        this.lightningShutDuration = 500;
        this.lightningShutTimeout = this.lightningShutDuration;
        this.lightningReloadSpeed = 3500;
        this.lightningReloadTimeout = this.lightningReloadSpeed;
        this.isLightningSoundPlay = false;

        this.hitScoresPlayerBullet = this.hp;
        this.destroyScoresPlayerBullet = this.hp * 5;
    }

    action(dt) {
        // движение
        turnObjectToTarget(this, player, this.turnSpeed * dt);
        moveObject(this, this.speed * dt);
        if (!checkObjectVisibility(this)) {
            this.isExist = false;
            return;
        }

        // перезарядка и стрельба
        if (this.lightningShutTimeout > 0) {
            if (getDistance(this, player) < this.lightningShutDistance) {
                drawLightning(this, player);
                this.lightningShutTimeout -= dt;
                if (this.lightningShutTimeout <= 0) player.addDamage(this.lightningDamage);

                if (this.isLightningSoundPlay === false) {
                    this.isLightningSoundPlay = true;
                    playSound('se_electro_shut.mp3');
                }
            } else {
                this.isLightningSoundPlay = false;
            }
        } else {
            this.lightningReloadTimeout -= dt;
            if (this.lightningReloadTimeout <= 0) {
                this.lightningReloadTimeout += this.lightningReloadSpeed;
                this.lightningShutTimeout = this.lightningShutDuration;
                this.isLightningSoundPlay = false;
            }
        }
    }
}

class EnemyBullet extends Sprite {
    constructor(x, y) {
        super('enemy_bullet_10x40px.png', x, y);
        this.speed = 0.15;
        this.power = 1;

        playSound('se_laser_shut_2.mp3');
    }

    update(dt) {
        this.y += this.speed * dt;
        if (this.y > this.halfHeight + VIEW.height) {
            this.isExist = false;
            return;
        }

        // проверка столкновения с игроком
        if ( getDistance(this, player) < player.size ) {
            player.addDamage(this.power);
            this.isExist = false;
            explosionsArr.push(new Explosion(this.x, this.y, 1));
        } else this.draw();
    }
}