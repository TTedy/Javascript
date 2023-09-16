function Pacman() {
    this.lives = 3;
  
    this.loseLife = function() {
      if (this.lives > 0) {
        this.lives--;
      }
    };
  }
  
  function Ghost() {
    this.col = 0;
    this.row = 0;
  
    this.move = function() {
      this.col = this.col + 1;
      this.row = this.row + 1;
    };
  }

  function pellets() {
    this.col = 0;
    this.row = 0;
    radius = 10;
    this.show = function() {
      fill(255, 255, 0);
      ellipse(this.col, this.row, radius, radius);
    }
    
  }

    function setup() {
        createCanvas(600, 600);
        background(0);
    }
