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
        this.sx = this.x + frameWidth;
        this.sy = this.y + frameHeight;
        this.spriteSheetArr = this.getSpriteSheetArr( frameWidth, frameHeight );
        this.hp = hp;
        this.fx = this.spriteSheetArr[this.hp].x;
        this.fy = this.spriteSheetArr[this.hp].y;
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
        if (this.hp < 0) this.isExist = false;
        else {
            this.fx = this.spriteSheetArr[this.hp].x;
            this.fy = this.spriteSheetArr[this.hp].y;
        }
    }

    update(dt) {
        this.draw();
    }
}

class BonusBrick extends Brick {
    constructor(imageName, x, y, frameWidth, frameHeight, hp) {
        super(imageName, x, y, frameWidth, frameHeight, hp);
        this.isBonus = true;
        this.frame  = 0; // номер текущего кадра анимации
        this.frames = this.spriteSheetArr.length;
        this.frameTimeout = 1000 / 30; // время ожидания следующего кадра анимации
        this.nextFrameTime = this.frameTimeout; // время следующего кадра анимации
        
    }

    update(dt) {
        this.nextFrameTime -= dt; // обновляем время включения следующего кадра
        if (this.nextFrameTime <= 0) {
            this.nextFrameTime += this.frameTimeout;
            this.frame++;
            if (this.frame === this.spriteSheetArr.length) this.frame = 0;
            this.fx = this.spriteSheetArr[this.frame].x;
            this.fy = this.spriteSheetArr[this.frame].y;
        }
        this.draw();
    }
}

class Platform extends Sprite {
    constructor(imageName, x, y) {
        super(imageName, x, y);
        this.sx = this.x + this.img.width;
        this.sy = this.y + this.img.height;
        this.speed = 0.4;
        this.hw = Math.floor(this.img.width / 2);
    }

    update(dt) {
        // проверяяем что бы платформа не вышла за пределы canvas
        if (mouseX > vw) mouseX = vw;
        if (mouseX < 0) mouseX = 0;

        // перемещение платформы вправо
        if (mouseX > this.x + this.hw) {
            this.x += this.speed * dt;
            this.sx = this.x + this.img.width;
        }
        // перемещение платформы влево
        if (mouseX < this.x + this.hw) {
            this.x -= this.speed * dt;
            this.sx = this.x + this.img.width;
        }
        this.draw();
    }
}

class Ball extends Sprite {
    constructor(imageName, x, y) {
        super(imageName, x, y);
        this.d  = this.img.width; // диаметр
        this.r  = Math.floor(this.d / 2); // радиус
        this.sx = this.x + this.d;
        this.sy = this.y + this.d;
        this.speed = 0.3;
        this.acc = 1.002;
        this.power = ballsPower;
        // генерируем случайное направление от 45 до 135 градусов
        this.dx = -(this.speed / 2) + Math.random() * this.speed;
        this.dy = -Math.sqrt(this.speed ** 2 - this.dx ** 2);
    }

    getBounceX() {
        // отражение по оси X
        this.dy *= this.acc;
        this.dx *= -this.acc;
    }

    getBounceY() {
        // отражение по оси Y
        this.dy *= -this.acc;
        this.dx *= this.acc;
    }

    checkCollision( x1, x2, y1, y2 ) {
        // проверка столкновения с блокам по координатам
        if (this.sx > x1 && this.x < x2 && this.sy > y1 && this.y < y2) {
            let intersectionLeft = this.x < x1 ? x1 - this.x : 0;    // o -> |__|
            let intersectionRight = this.sx > x2 ? this.sx - x2 : 0; // |__| <- o
            let intersectionTop = this.y < y1 ? y1 - this.y : 0;
            let intersectionBottom = this.sy > y2 ? this.sy - y2 : 0;

            let intersectionMax = Math.max(intersectionLeft, intersectionRight, intersectionTop, intersectionBottom);

            if (intersectionMax === intersectionLeft) {
                this.getBounceX();
                this.x = x1 - this.d;
            } else if (intersectionMax === intersectionRight) {
                this.getBounceX();
                this.x = x2;
            } else if (intersectionMax === intersectionTop) {
                this.getBounceY();
                this.y = y1 - this.d;
            } else {
                this.getBounceY();
                this.y = y2;
            }
            return true;
        }
        return false;
    }

    update(dt) {
        // перемещение
        this.x += this.dx * dt;
        this.y += this.dy * dt;

        // обновление крайних координат
        this.sx = this.x + this.d;
        this.sy = this.y + this.d;

        if (this.y < 0) { // проверка столкновения с верхней границей canvas
            this.y = 0;
            this.getBounceY();
            SE['se_platform.mp3'].play();
        }
        if (this.x < 0 || this.sx > vw) { // проверка столкновения с боковыми границами canvas
            this.x = this.x <= 0 ? 0 : vw - this.d;
            this.getBounceX();
            SE['se_platform.mp3'].play();
        }

        if (this.y + this.r > platform.y) { // проверка столкновения с нижней границей canvas
            this.isExist = false;
            SE['se_start.mp3'].play();
        }

        // проверка столкновения с блоками
        let isCollied = false;
        bricksArr.forEach( brick => {
            if (!isCollied && this.checkCollision( brick.x, brick.sx, brick.y, brick.sy )) {
                if (brick.isBonus) {
                    let bonusesList = ['bonus_balls.png', 'bonus_slow.png', 'bonus_speed.png', 'bonus_power.png',];
                    let bonusImageIndex = Math.floor(Math.random() * bonusesList.length);
                    let bonusImage = bonusesList[ bonusImageIndex ];
                    // Bonus extends Sprite (imageName, x, y)
                    bonusesArr.push( new Bonus(bonusImage, brick.x, brick.y) );
                    SE['se_bonus.mp3'].play();
                }
                isCollied = true;
                brick.getHit(this.power);
            }
        });

        // проверка столкновения с платформой
        if ( this.sy > platform.y && this.sx > platform.x && this.x < platform.sx ) {
            // отбитие мяча
            this.y = platform.y - this.d;
            this.getBounceY();

            // определяем смещения точки столкновения от центра платформы
            let offsetX = (this.x + this.r) - (platform.x + platform.hw);
            let kX = Math.abs( offsetX / platform.img.width );
            
            // находим квадрат скорости и скорость
            let speed2 = this.dx ** 2 + this.dy ** 2;

            // рассчет смещения скорости по оси X
            let speedX = Math.sqrt(speed2) * kX;
            // обновление скоростей dx и dy
            this.dx += (offsetX > 0) ? speedX : -speedX;
            let speed2Y = Math.abs(speed2 - this.dx ** 2);
            this.dy = -Math.sqrt(speed2Y);

            SE['se_platform.mp3'].play();
        }

        this.draw();
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
                    ballsArr.forEach( ball => {
                        let speed = Math.sqrt( ball.dx ** 2 + ball.dy ** 2 );
                        let speedDivider = speed / ball.speed;
                        ball.dx /= speedDivider;
                        ball.dy /= speedDivider;
                    });
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
        this.speed = 0.3;
        this.dx = -(this.img.width - vw) / vw
        this.dy = -(this.img.height - vh) / vh
    }

    update() {
        if (ballsArr.length > 0) {
            if (this.x < ballsArr[0].x * this.dx + this.speed)
                this.x += this.speed;
            else if (this.x > ballsArr[0].x * this.dx - this.speed)
                this.x -= this.speed;

            if (this.y < ballsArr[0].y * this.dy + this.speed)
                this.y += this.speed;
            else if (this.y > ballsArr[0].y * this.dy - this.speed)
                this.y -= this.speed;
        }
        ctx.drawImage(this.img, this.x, this.y);
    }
}
