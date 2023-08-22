'use strict';

/*
**  КЛАССЫ ИГРОВЫХ ОБЪЕКТОВ
*/

// Игровой курсор
class GameCursor extends SpriteSheet {
    constructor() {
        super('cursor_48x48px_16frames.png', VIEW.x, VIEW.y, 48, 48, 16, 15);
    }

    update(dt) {
        this.x = CURSOR.x;
        this.y = CURSOR.y;
        this.drawWithAnimation(dt);
    }
}

// Движущееся фоновое изображение из тайлов
class ScrollingBackground extends TileSprite {
    constructor (imageName, scrollSpeed) {
        super(imageName, VIEW.x, VIEW.y, VIEW.width, VIEW.height + IMG[imageName].height, 'center', 'center');
        this.offsetY = IMG[imageName].height;
        this.y -= Math.floor(this.offsetY / 2);
        this.restartPointY = this.y + this.offsetY;
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

    update(dt) {
        this.y += this.scrollSpeed * dt;
        if (this.y >= this.restartPointY) this.y -= this.offsetY;
        this.draw();
    }
}

// Фоновый спрайт
class BackgroundSprite extends Sprite {
    constructor (imageName, scrollSpeed, periodicity) {
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
        super(imageName, x, y, frameWidth, frameHeight, frames, fps, Math.random() * _2PI);
    }

    update(dt) {
        if (this.frame === this.frames - 1) this.isExist = false;
        else this.drawWithAnimation(dt);
    }
}

// Текст для очков со свечением и плавным исчезновением
class MessageText extends TextSprite {
    constructor(text, x, y) {
        super(text, x, y, {weight: 'bold', size: 20, family: 'PTSans', fillColor: '#ffff00', align: 'center'});
        this.shadowColor = '#ff00ff';
        this.hideTime = 2000;
        this.visibleTime = 1000;
        this.alphaStepPerMillisecond = 1 / this.hideTime;
        this.speedY = 0.02;
        this.alpha = 1;
    }

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

        CONTEXT.save();
        if (this.alpha < 1) CONTEXT.globalAlpha = this.alpha;
        CONTEXT.shadowBlur  = 5;
        CONTEXT.shadowColor = this.shadowColor;
        CONTEXT.globalCompositeOperation = 'lighter';
        this.draw();
        CONTEXT.restore();
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
        if (this.sphereTimeout > 0) return;

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