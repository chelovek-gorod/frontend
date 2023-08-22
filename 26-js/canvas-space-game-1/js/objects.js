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