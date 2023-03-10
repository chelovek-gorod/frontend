'use strict';

/**********************************
 * 
 *   БАЗОВЫЕ ИГРОВЫЕ ОБЪЕКТЫ
 */

class Sprite {
    constructor(imageName, x, y) {
        this.sprite = IMAGES_ARR.find(image => image.name === imageName);
        this.x = x;
        this.y = y;
        this.img = this.sprite.img;
        this.fx = 0; // current frame x
        this.fy = 0; // current frame y
        this.fn = 1; // frames number
        this.fw = this.sprite.width;
        this.fh = this.sprite.height;
        this.isExist = true;
    }

    draw() {
        ctx.drawImage(
            this.img, // image
            this.fx, this.fy, // frame [x, y] on sprite image
            this.fw, this.fh, // frame width and height
            this.x,  this.y,  // start point[x, y] to draw on canvas
            this.fw, this.fh  // frame width and height to draw on canvas
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
        for( let yy = 0; yy < this.sprite.height; yy += frameHeight) {
            for( let xx = 0; xx < this.sprite.width; xx += frameWidth) {
                spriteSheetArr.push( {x: xx, y: yy} );
            }
        }
        return spriteSheetArr;
    }

    getHit() {
        playSeGame('se_brick.mp3');
        this.hp--;
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
        this.fc = 0; // current frame (frame number)
        this.isBonus = true;
        this.fn = this.spriteSheetArr.length; // frames number
        this.ft = 1000 / 60; // next frame timeout
        this.fd = this.ft; // full frame duration of awaiting next frame
        this.fw = frameWidth;
        this.fh = frameHeight;
    }

    update(dt) {
        this.fd -= dt;
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
        this.hw = Math.floor(this.sprite.width / 2);
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
        // 0   - to bottom
        // 90  - to right
        // 180 - to top
        // 270 - to left
        this.direction = (135 + Math.random() * 90) * (Math.PI / 180);
        this.ricochetW = 180 * (Math.PI / 180);
        this.ricochetH = 360 * (Math.PI / 180);
        this.r = Math.floor(this.sprite.width / 2);
        this.d = this.sprite.width;
    }

    update(dt) {
        this.x += Math.sin(this.direction) * this.speed * dt;
        this.y += Math.cos(this.direction) * this.speed * dt;

        if (this.y <= 0) {
            this.direction = this.ricochetW - this.direction;
            this.y = 0;
            playSeGame('se_platform.mp3');
        }
        if (this.x <= 0 || this.x + this.d >= vw) {
            this.direction = this.ricochetH - this.direction;
            this.x = (this.x < 0) ? 0 : vw - this.d;
            playSeGame('se_platform.mp3');
        }
        if (this.y >= vh) {
            this.isExist = false;
            playSeGame('se_start.mp3');
        }

        bricksArr.forEach( b => {
            let r = this.testCollied( b );
            if (r) {
                if (b.isBonus) {
                    let bonusesList = ['bonus_balls.png', 'bonus_slow.png', 'bonus_speed.png'];
                    let bonusImageIndex = Math.floor(Math.random() * bonusesList.length);
                    let bonusImage = bonusesList[ bonusImageIndex ];
                    bonusesArr.push( new Bonus(bonusImage, b.x, b.y) );
                }
                b.getHit();
                this.direction = r - this.direction;
            }
        });

        if (this.testCollied(platform)) {
            playSeGame('se_platform.mp3');
            let k = 1 + ((this.x + this.r) - (platform.x + platform.hw)) / (platform.fw * 2);
            this.y = platform.y - platform.fh;
            this.direction = this.ricochetW / k - this.direction;
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

        // get distance
        let dx = cx - xx;
        let dy = cy - yy;
        if( Math.sqrt( (dx * dx) + (dy * dy) ) > this.r) return null;
        this.speed += this.acc;
        return dy < dx ? this.ricochetW : this.ricochetH;
    }
}

class Bonus extends Sprite {
    constructor(imageName, x, y) {
        super(imageName, x - 48, y - 18);
        this.speed = -0.2;
        this.acc = 0.0015;
        this.side = this.sprite.width;
    }

    update(dt) {
        this.y += this.speed * dt;
        this.speed += this.acc;

        if (this.y > vh) {
            this.isExist = false;
        }

        if (this.x + this.side >= platform.x
        && this.x <= platform.x + platform.sprite.width
        && this.y + this.side >= platform.y
        && this.y <= platform.y + platform.sprite.height) {
            switch (this.sprite.name) {
                case 'bonus_balls.png' :
                    ballsArr.push( new Ball('ball.png', ballsArr[0].x, ballsArr[0].y) );
                    ballsArr.push( new Ball('ball.png', ballsArr[0].x, ballsArr[0].y) );
                    playSeGame('se_bonus_balls.mp3');
                    break;
                case 'bonus_slow.png' :
                    ballsArr.forEach( ball => ball.speed = 0.2 );
                    playSeGame('se_bonus_slow.mp3');
                    break;
                case 'bonus_speed.png' :
                    platform.speed += 0.1;
                    playSeGame('se_bonus_speed.mp3');
                    break;
            }
            this.isExist = false;
        }

        this.draw();
    }
}

class Background extends Sprite {
    constructor( imageName, x, y ) {
        super(imageName, x, y);
        this.dx = -(this.sprite.width - vw) / vw
        this.dy = -(this.sprite.height - vh) / vh
    }

    update() {
        if (ballsArr.length > 0) {
            this.x = ballsArr[0].x * this.dx;
            this.y = ballsArr[0].y * this.dy;
        }
        ctx.drawImage(this.img, this.x, this.y);
    }
}