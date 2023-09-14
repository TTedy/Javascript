// Thanks to Renan Martineli for this version of the demo

window.addEventListener('load', function() {

  // Your code here
  // This code will only execute after the page has fully loaded

    
  // setup canvas

  const para = document.querySelector('p');
  let count = 0;

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  const width = canvas.width = window.innerWidth;
  const height = canvas.height = window.innerHeight;

  // function to generate random number

  function random(min,max) {
    const num = Math.floor(Math.random()*(max-min)) + min;
    return num;
  };

  // function to generate random RGB color value

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

  // function powerpellets() {

  function powerpellets () {
    const powerpellets = [];
    while (powerpellets.length < 4) {
      const size = 10;
      const powerpellet = new Powerpellet(
        // powerpellet position always drawn at least one powerpellet width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        randomRGB(),
        size
      );
      powerpellets.push(powerpellet);
      count++;
      para.textContent = 'Powerpellet count: ' + count;
    }
  }

  class EvilCircle extends Shape {
    constructor(x, y) {
      super(x, y, 20, 20);
  
      this.size = 15;
      this.fillStyle = "Yellow";
      this.color = "Yellow";
      this.angle = 0; // Initial angle for Pac-Man's mouth (in radians)
  
      window.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'ArrowLeft':
            this.x -= this.velX;
            this.angle = Math.PI; // Left (180 degrees)
            break;
          case 'ArrowRight':
            this.x += this.velX;
            this.angle = 0; // Right (0 degrees)
            break;
          case 'ArrowUp':
            this.y -= this.velY;
            this.angle = -Math.PI / 2; // Up (-90 degrees)
            break;
          case 'ArrowDown':
            this.y += this.velY;
            this.angle = Math.PI / 2; // Down (90 degrees)
            break;
          // Add support for 'n', 'v', 's', 'a' keys
          case 'n':
            this.x += this.velX;
            this.angle = 0; // Right (0 degrees)
            break;
          case 'v':
            this.x -= this.velX;
            this.angle = Math.PI; // Left (180 degrees)
            break;
          case 's':
            this.y -= this.velY;
            this.angle = -Math.PI / 2; // Up (-90 degrees)
            break;
          case 'a':
            this.y += this.velY;
            this.angle = Math.PI / 2; // Down (90 degrees)
            break;
        }
      });
    }

    draw() {
      ctx.save(); // Save the current transformation state
  
      ctx.translate(this.x, this.y); // Move the context to Pac-Man's position
      ctx.rotate(this.angle); // Rotate based on the direction
  
      // Draw Pac-Man
      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.arc(0, 0, this.size, 0.2 * Math.PI, 1.8 * Math.PI);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
  
      // Draw Pac-Man eyes
      const eyeRadius = this.size / 10; // Adjust eye size as needed
      const eyeOffsetX = this.size / 3; // Adjust eye position as needed
      const eyeOffsetY = -this.size / 3; // Adjust eye position as needed
  
      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.arc(-eyeOffsetX, eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
      ctx.fill();
  
      // Reset scaling if it was flipped
      ctx.scale(-1, 1); // Reset scaling
  
      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.arc(-eyeOffsetX, eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
      ctx.fill();
  
      ctx.restore(); // Restore the previous transformation state
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

  }

  // define array to store balls and populate it

  const balls = [];

  while (balls.length < 25) {
    const size = random(10, 20);
    const ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
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

  const evilBall = new EvilCircle(random(0, width), random(0, height));

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

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', function() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  loop();

});


