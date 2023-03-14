'use strict';

/********************** 
 * 
 *   ИГРОВЫЕ КЛАССЫ
 */

class Sprite {
    constructor(imageName, x, y) {
        this.img = IMG[imageName];
        this.x = x;
        this.y = y;
        this.fx = 0; // координата x текущего кадра
        this.fy = 0; // координата y текущего кадра
        this.fn = 1; // количество кадров
        this.fw = this.img.width;
        this.fh = this.img.height;
        this.isExist = true;
    }

    draw() {
        ctx.drawImage(
            this.img, // ссылка на изображение
            this.fx, this.fy, // Координаты текущего кадра [x, y] на изображении
            this.fw, this.fh, // Ширина и высоты текущего кадра
            this.x,  this.y,  // Координаты на canvas [x, y] для отрисовки кадра
            this.fw, this.fh  // Ширина и высоты текущего кадра для отрисовки на canvas
        );
    }
}

class Brick extends Sprite {
    constructor(imageName, x, y, frameWidth, frameHeight, hp) {
        super(imageName, x, y);
        this.spriteSheetArr = this.getSpriteSheetArr( frameWidth, frameHeight );
        this.hp = hp;
        this.fx = this.spriteSheetArr[this.hp - 1].x;
        this.fy = this.spriteSheetArr[this.hp - 1].y;
        this.fw = frameWidth;
        this.fh = frameHeight;
    }

    getSpriteSheetArr( frameWidth, frameHeight ) {
        let spriteSheetArr = [];
        for( let yy = 0; yy < this.img.height; yy += frameHeight) {
            for( let xx = 0; xx < this.img.width; xx += frameWidth) {
                spriteSheetArr.push( {x: xx, y: yy} );
            }
        }
        return spriteSheetArr;
    }

    getHit(power) {
        SE['se_brick.mp3'].currentTime = 0;
        SE['se_brick.mp3'].play();
        this.hp -= power;
        if (this.hp < 1) this.isExist = false;
        else {
            this.fx = this.spriteSheetArr[this.hp - 1].x;
            this.fy = this.spriteSheetArr[this.hp - 1].y;
        }
    }

    update(dt) {
        this.draw();
    }
}

class BonusBrick extends Brick {
    constructor(imageName, x, y, frameWidth, frameHeight, hp) {
        super(imageName, x, y, frameWidth, frameHeight, hp);
        this.fc = 0;
        this.isBonus = true;
        this.fn = this.spriteSheetArr.length;
        this.ft = 1000 / 60; // время ожидания следующего кадра анимации
        this.fd = this.ft; // время включения следующего кадра анимации
        this.fw = frameWidth;
        this.fh = frameHeight;
    }

    update(dt) {
        this.fd -= dt; // обновляем время включения следующего кадра анимации
        if (this.fd < 0) {
            this.fd += this.ft;
            this.fc++;
            if (this.fc === this.fn) this.fc = 0;
            this.fx = this.spriteSheetArr[this.fc].x;
            this.fy = this.spriteSheetArr[this.fc].y;
        }
        this.draw();
    }
}

class Platform extends Sprite {
    constructor(imageName, x, y) {
        super(imageName, x, y);
        this.speed = 0.4;
        this.hw = Math.floor(this.img.width / 2);
    }

    update(dt) {
        if (mouseX > vw) mouseX = vw;
        if (mouseX < 0) mouseX = 0;
        if (mouseX > this.x + this.hw) this.x += this.speed * dt;
        if (mouseX < this.x + this.hw) this.x -= this.speed * dt;
        this.draw();
    }
}

`
sin(a) = h/d       
cos(a) = w/d

(dx, dy)                
   |\
  h| \ d
   |__\ 
    w  (x, y)

dx(w) = cos(a) * d
dy(h) = sin(a) * d
`;

class Ball extends Sprite {
    constructor(imageName, x, y) {
        super(imageName, x, y);
        this.speed = 0.3;
        this.acc = 0.002;
        this.power = ballsPower;
        // 0   - направление движения вниз
        // 90  - направление движения вправо
        // 180 - направление движения вверх
        // 270 - направление движения влево
        this.direction = (135 + Math.random() * 90) * (Math.PI / 180);
        this.ricochetW = 180 * (Math.PI / 180); // угол рикошета от горизонтали
        this.ricochetH = 360 * (Math.PI / 180); // угол рикошета от вертикали
        this.r = Math.floor(this.img.width / 2); // радиус
        this.d = this.img.width; // диаметр
    }

    update(dt) {
        // перемещение
        this.x += Math.sin(this.direction) * this.speed * dt;
        this.y += Math.cos(this.direction) * this.speed * dt;

        if (this.y <= 0) { // проверка столкновения с верхней границей canvas
            this.direction = this.ricochetW - this.direction;
            this.y = 0;
            SE['se_platform.mp3'].play();
        }
        if (this.x <= 0 || this.x + this.d >= vw) { // проверка столкновения с боковыми границами canvas
            this.direction = this.ricochetH - this.direction;
            this.x = (this.x < 0) ? 0 : vw - this.d;
            SE['se_platform.mp3'].play();
        }
        if (this.y >= vh) { // проверка столкновения с нижней границей canvas
            this.isExist = false;
            SE['se_start.mp3'].play();
        }

        // проверка столкновения с блоками
        bricksArr.forEach( block => {
            let ricochet = this.testCollied( block );
            if (ricochet) {
                if (block.isBonus) {
                    let bonusesList = ['bonus_balls.png', 'bonus_slow.png', 'bonus_speed.png', 'bonus_power.png',];
                    let bonusImageIndex = Math.floor(Math.random() * bonusesList.length);
                    let bonusImage = bonusesList[ bonusImageIndex ];
                    bonusesArr.push( new Bonus(bonusImage, block.x, block.y) );
                    SE['se_bonus.mp3'].play();
                }
                block.getHit(this.power);
                this.direction = ricochet - this.direction;
            }
        });

        // проверка столкновения с платформой
        if (this.testCollied(platform)) {
            SE['se_platform.mp3'].play();
            // угловой коэффициент рикошета (изменяется при удалении от центра платформы)
            // добавляя от -30 до 30 градусов (-0,5...0,5 радиан) к углу рикошета мяча
            let k = ( (this.x + this.d) - (platform.x + platform.hw) ) / (platform.img.width * 2);
            this.y = platform.y - platform.fh;
            this.direction = this.ricochetW - this.direction - k;
        }

        this.draw();
    }

    testCollied( block ) {
        let cx = this.x + this.r;
        let cy = this.y + this.r;

        let xx = cx;
        let yy = cy;

        if (cx < block.x) xx = block.x
        else if (cx > block.x + block.fw) xx = block.x + block.fw;

        if (cy < block.y) yy = block.y;
        else if (cy > block.y + block.fh) cy = block.y + block.fh;  

        // определение растояния
        let dx = cx - xx;
        let dy = cy - yy;
        if( Math.sqrt( (dx * dx) + (dy * dy) ) > this.r) return null;
        this.speed += this.acc;
        return dy < dx ? this.ricochetW : this.ricochetH;
    }
}

class Bonus extends Sprite {
    constructor(imageName, x, y) {
        super(imageName, x, y - 16);
        this.name = imageName;
        this.speed = -0.2;
        this.acc = 0.0025;
        this.side = this.img.width;
    }

    update(dt) {
        this.y += this.speed * dt;
        this.speed += this.acc;

        if (this.y > vh) {
            this.isExist = false;
        }

        if (this.x + this.side >= platform.x
        && this.x <= platform.x + platform.img.width
        && this.y + this.side >= platform.y
        && this.y <= platform.y + platform.img.height) {
            switch (this.name) {
                case 'bonus_balls.png' :
                    ballsArr.push( new Ball('ball.png', ballsArr[0].x, ballsArr[0].y) );
                    ballsArr.push( new Ball('ball.png', ballsArr[0].x, ballsArr[0].y) );
                    SE['se_bonus_balls.mp3'].play();
                    break;
                case 'bonus_slow.png' :
                    ballsArr.forEach( ball => ball.speed = 0.2 );
                    SE['se_bonus_slow.mp3'].play();
                    break;
                case 'bonus_speed.png' :
                    platform.speed += 0.1;
                    SE['se_bonus_speed.mp3'].play();
                    break;
                case 'bonus_power.png':
                    ballsPower += 1;
                    ballsArr.forEach( ball => ball.power = ballsPower );
                    SE['se_bonus_power.mp3'].play();
            }
            this.isExist = false;
        }

        this.draw();
    }
}

class Background extends Sprite {
    constructor(imageName, x, y) {
        super(imageName, x, y);
        this.dx = -(this.img.width - vw) / vw
        this.dy = -(this.img.height - vh) / vh
    }

    update() {
        if (ballsArr.length > 0) {
            this.x = ballsArr[0].x * this.dx;
            this.y = ballsArr[0].y * this.dy;
        }
        ctx.drawImage(this.img, this.x, this.y);
    }
}
