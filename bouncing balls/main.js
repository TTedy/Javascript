window.addEventListener('load', function() {
  const para = document.querySelector('p');
  let count = 0;

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  const width = canvas.width = window.innerWidth;
  const height = canvas.height = window.innerHeight;

  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
  };

  function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
  }

  class Shape {
    constructor(x, y, velX, velY) {
      this.x = x;
      this.y = y;
      this.velX = velX;
      this.velY = velY;
    }
  }

  class Ball extends Shape {
    constructor(x, y, velX, velY, color, size) {
      super(x, y, velX, velY);
      this.color = color;
      this.size = size;
      this.exists = true;
    }

    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    }

    update() {
      if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
      }

      if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
      }

      if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
      }

      if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
      }

      this.x += this.velX;
      this.y += this.velY;
    }

    collisionDetect() {
      for (const ball of balls) {
        if (!(this === ball) && ball.exists) {
          const dx = this.x - ball.x;
          const dy = this.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.size + ball.size) {
            ball.color = this.color = randomRGB();
          }
        }
      }
    }
  }

  class EvilCircle extends Shape {
    constructor(x, y) {
      super(x, y, 20, 20);
      this.size = 15;
      this.fillStyle = "Yellow";
      this.color = "Yellow";
      this.angle = 0;
      this.powerMode = false;
      this.powerModeDuration = 5000;
      this.powerModeTimeLeft = 0;

      window.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'n':
            this.x += this.velX;
            this.angle = 0;
            break;
          case 'v':
            this.x -= this.velX;
            this.angle = Math.PI;
            break;
          case 's':
            this.y -= this.velY;
            this.angle = -Math.PI / 2;
            break;
          case 'a':
            this.y += this.velY;
            this.angle = Math.PI / 2;
            break;
        }
      });

      document.addEventListener('touchstart', (e) => {
        [...e.changedTouches].forEach((touch) => {
          const x = touch.clientX;
          const y = touch.clientY;

          const buttons = document.querySelectorAll('.touchpad-button');
          buttons.forEach((button) => {
            const buttonRect = button.getBoundingClientRect();

            if (
              x >= buttonRect.left &&
              x <= buttonRect.right &&
              y >= buttonRect.top &&
              y <= buttonRect.bottom
            ) {
              switch (button.id) {
                case 'up':
                  this.y -= this.velY;
                  this.angle = -Math.PI / 2;
                  break;
                case 'left':
                  this.x -= this.velX;
                  this.angle = Math.PI;
                  break;
                case 'right':
                  this.x += this.velX;
                  this.angle = 0;
                  break;
                case 'down':
                  this.y += this.velY;
                  this.angle = Math.PI / 2;
                  break;
              }
            }
          });
        });
      });
    }

    draw() {
      ctx.save();

      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.arc(0, 0, this.size, 0.2 * Math.PI, 1.8 * Math.PI);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();

      const eyeRadius = this.size / 10;
      const eyeOffsetX = this.size / 3;
      const eyeOffsetY = -this.size / 3;

      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.arc(-eyeOffsetX, eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
      ctx.fill();

      ctx.scale(-1, 1);

      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.arc(-eyeOffsetX, eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
      ctx.fill();

      ctx.restore();
    }

    checkBounds() {
      if ((this.x + this.size) >= width) {
        this.x -= this.size;
      }

      if ((this.x - this.size) <= 0) {
        this.x += this.size;
      }

      if ((this.y + this.size) >= height) {
        this.y -= this.size;
      }

      if ((this.y - this.size) <= 0) {
        this.y += this.size;
      }
    }

    collisionDetect() {
      for (const ball of balls) {
        if (ball.exists) {
          const dx = this.x - ball.x;
          const dy = this.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.size + ball.size) {
            ball.exists = false;
            count--;
            para.textContent = 'Ball count: ' + count;
          }
        }
      }
    }

    collisionDetect2(ghosts) {
      for (const ghost of ghosts) {
        if (ghost.exists) {
          const dx = this.x - ghost.x;
          const dy = this.y - ghost.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.size + ghost.size) {
            gameOver = true;
            return;
          }
        }
      }
    }

    startPowerMode() {
      this.powerMode = true;
      this.powerModeTimeLeft = this.powerModeDuration;
    }

    isPowerModeExpired() {
      return this.powerModeTimeLeft <= 0;
    }
  }

  class Ghost extends Shape {
    constructor(x, y, velX, velY, color, size) {
      super(x, y, velX, velY);
      this.color = color;
      this.originalColor = color;
      this.size = size;
      this.exists = true;
      this.isVisible = true;
      this.isBlinking = false;
    }

    draw(ctx) {
      if (this.exists && this.isVisible) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, Math.PI, 2 * Math.PI);
        ctx.arc(this.x - this.size / 2, this.y - this.size / 2, this.size / 4, 0, Math.PI * 2);
        ctx.arc(this.x + this.size / 2, this.y - this.size / 2, this.size / 4, 0, Math.PI * 2);
        ctx.moveTo(this.x - this.size / 2, this.y + this.size / 4);
        ctx.arc(this.x, this.y + this.size / 4, this.size / 2, Math.PI, 0);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
    }

    update() {
      if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
      }

      if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
      }

      if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
      }

      if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
      }

      this.x += this.velX;
      this.y += this.velY;
    }

    collisionDetect() {
      for (const ball of balls) {
        if (!(this === ball) && ball.exists) {
          const dx = this.x - ball.x;
          const dy = this.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.size + ball.size) {
            ball.color = this.color = randomRGB();
          }
        }
      }
    }

    collisionDetect(evilCircle) {
      const dx = this.x - evilCircle.x;
      const dy = this.y - evilCircle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + evilCircle.size) {
        if (evilCircle.isPowerModeExpired()) {
          gameOver = true;
        } else {
          this.exists = false;
        }
      }
    }

    blink() {
      if (this.isBlinking) {
        this.color = this.isVisible ? this.originalColor : 'transparent';
      } else {
        this.color = this.originalColor;
      }
    }
  }

  const balls = [];

  while (balls.length < 25) {
    const size = random(10, 20);
    const ball = new Ball(
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-7, 7),
      random(-7, 7),
      randomRGB(),
      size
    );
    balls.push(ball);
    count++;
    para.textContent = 'Ball count: ' + count;
  }

  const ghosts = [];
  while (ghosts.length < 5) {
    const size = random(10, 20);
    const ghost = new Ghost(
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(1, 2),
      random(1, 2),
      randomRGB(),
      size
    );
    ghosts.push(ghost);
  }

  class PowerPellet extends Shape {
    constructor(x, y, size) {
      super(x, y);
      this.size = size;
      this.blinking = false;
      this.blinkInterval = null;
      this.effectDuration = 5000;
      this.exists = true;
      this.ghosts = [];

      this.startBlinking();
    }

    draw() {
      if (this.exists && !this.blinking) {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    startBlinking() {
      if (!this.blinking) {
        this.blinkInterval = setInterval(() => {
          this.blinking = !this.blinking;

          for (const ghost of this.ghosts) {
            ghost.isVisible = this.blinking;
            ghost.isBlinking = this.blinking;
          }
        }, 250);

        setTimeout(() => {
          this.stopBlinking();
        }, this.effectDuration);
      }
    }

    stopBlinking() {
      if (this.blinking) {
        clearInterval(this.blinkInterval);
        this.blinking = false;

        for (const ghost of this.ghosts) {
          ghost.isVisible = true;
        }
      }
    }
  }

  const powerPellets = [];

  while (powerPellets.length < 6) {
    const size = random(10, 20);
    const PP = new PowerPellet(
      random(0 + size, width - size),
      random(0 + size, height - size),
      size
    );
    powerPellets.push(PP);
  }

  function getRandomPosition(canvasWidth, canvasHeight) {
    const x = Math.random() * canvasWidth;
    const y = Math.random() * canvasHeight;
    return { x, y };
  }

  const evilBall = new EvilCircle(random(0, width), random(0, height));
  let gameOver = false;

  class PacManDot extends Shape {
    constructor(x, y, size, color) {
      super(x, y);
      this.size = size;
      this.color = color;
      this.exists = true;
    }

    draw() {
      if (this.exists) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  const pacManDots = [];

  while (pacManDots.length < 50) {
    const size = 5;
    const color = 'white';
    const dot = new PacManDot(
      random(0 + size, width - size),
      random(0 + size, height - size),
      size,
      color
    );
    pacManDots.push(dot);
  }

  let score = 0;
  const dotCountElement = document.getElementById('dotCount');

  function updateDotCount() {
    dotCountElement.textContent = `Pac-Man Dots: ${score}`;
  }

  function checkCollisionsWithDots() {
    for (let i = 0; i < pacManDots.length; i++) {
      const dot = pacManDots[i];
      if (dot.exists) {
        const dx = evilBall.x - dot.x;
        const dy = evilBall.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < evilBall.size + dot.size) {
          dot.exists = false;
          score += 1;
          updateDotCount();

          if (score === 50) {
            console.log('You win!');
          }
        }
      }
    }
  }

  function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (const ball of balls) {
      if (ball.exists) {
        ball.draw();
        ball.update();
        ball.collisionDetect();
      }
    }

    evilBall.draw();
    evilBall.checkBounds();
    evilBall.collisionDetect();
    evilBall.collisionDetect2(ghosts);

    for (const powerPellet of powerPellets) {
      if (
        powerPellet.exists &&
        !powerPellet.blinking &&
        distance(evilBall.x, evilBall.y, powerPellet.x, powerPellet.y) < evilBall.size + powerPellet.size
      ) {
        powerPellet.startBlinking();
        powerPellet.exists = false;

        evilBall.startPowerMode();
      }
      if (powerPellet.exists) {
        powerPellet.draw();
      }
    }
    console.log(powerPellets.effectDuration);

    for (const ghost of ghosts) {
      if (ghost.exists) {
        ghost.draw(ctx);
        ghost.update();
        ghost.collisionDetect(evilBall);
      }
    }

    for (const dot of pacManDots) {
      if (dot.exists) {
        dot.draw();
      }
    }

    checkCollisionsWithDots();
    updateDotCount();
    requestAnimationFrame(loop);
  }

  function distance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  loop();
});
