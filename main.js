//2D engine for games

const CANVAS = document.getElementById("canvas");
const CTX = canvas.getContext("2d");
const WINDOW = window;

//hold your dots
let DOTS = [];

class Dot {
  constructor(x, y, mass) {
    this.x = x;
    this.y = y;
    this.r = 50;
    this.mass = mass;
    this.v = new Vector(0, 0);
    this.a = new Vector(0, 0);
    this.color = "red";
    DOTS.push(this);
    this.setBounds(CANVAS);
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  //Set bounds as canvas
  setBounds(CANVAS) {
    this.maxX = CANVAS.width;
    this.maxY = CANVAS.height;
  }

  drawVelociy(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.v.x * 20, this.y + this.v.y * 20);
    ctx.fillStyle = "purple";
    ctx.stroke();
    ctx.closePath();
  }

  borderCollision() {
    if (this.x + this.r > this.maxX) {
      this.x = this.maxX - this.r;
      this.v.x *= -1;
    } else if (this.x - this.r < 0) {
      this.x = this.r;
      this.v.x *= -1;
    }
    if (this.y + this.r > this.maxY) {
      this.y = this.maxY - this.r;
      this.v.y *= -1;
      console.log("collision");
    } else if (this.y - this.r < 0) {
      this.y = this.r;
      this.v.y *= -1;
      console.log("collision");
    }
  }

  ballCollision(dot) {
    let dx = this.x - dot.x;
    let dy = this.y - dot.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.r + dot.r) {
        let angle = Math.atan2(dy, dx);
        let targetX = dot.x + Math.cos(angle) * this.r;
        let targetY = dot.y + Math.sin(angle) * this.r;
        let ax = (targetX - this.x) * 0.5;
        let ay = (targetY - this.y) * 0.5;
        this.v.x -= ax;
        this.v.y -= ay;
        dot.v.x += ax;
        dot.v.y += ay;
    }
    }

    drawDebug(ctx) {
        CTX.fillText("Y-Pos: " + this.y, 50, 50);
        CTX.fillText("X-Pos: " + this.x, 50, 60);
        CTX.fillText("Velocity Y: " + this.v.y, 50, 70);
        CTX.fillText("Velocity X: " + this.v.x, 50, 80);
        CTX.fillText("Acceleration Y: " + this.a.y, 50, 90);
        CTX.fillText("Acceleration X: " + this.a.x, 50, 100);
    }


  drawAcceleration(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.a.x * 100, this.y + this.a.y * 100);
    ctx.fillStyle = "blue";
    ctx.stroke();
    ctx.closePath();
  }

  //apply friction to the dot
  friction() {
    this.v.x *= 0.99;
    this.v.y *= 0.99;
  }

  //apply gravity to the dot
  gravity() {
    this.a.y = new Vector(0, 0.2).mul(this.mass).y;
    this.v = this.v.add(this.a.mul(this.a.mag()));
    this.y += this.v.y;
  }

  //accelerate the dot to given direction, modify the acceleration vector
  accelerate() {
    let accelerateX = 0.25;
    let accelerateY = 0.0;
    //set acceleration
    this.a = new Vector(accelerateX, accelerateY);
    //set velocity according to acceleration (add acceleration to velocity)
    this.v = this.v.add(this.a.mul(this.a.mag()));

    //velocity added to current y position
    this.y += this.v.y;
    //velocity added to current x position
    this.x += this.v.x;
  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  sub(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }
  //multiply by scalar
  mul(s) {
    return new Vector(this.x * s, this.y * s);
  }
  //divide by scalar
  div(s) {
    return new Vector(this.x / s, this.y / s);
  }
  //length of vector (magnitude)
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  //tan of velocity vector
  tan() {
    return this.y / this.x;
  }
  //normalize vector (make it a unit vector)
  normalize() {
    if (this.mag() > 0) {
      return this.div(this.mag());
    }
    return this;
  }
}

function distanceBetweenCircles(d1, d2) {
  return Math.sqrt(Math.pow(d1.x - d2.x, 2) + Math.pow(d1.y - d2.y, 2));
}

//generate small dots

let dot = new Dot(Math.random() * (600 - 40), 100, 1, 0.92);
let dot2 = new Dot(Math.random() * (600 - 40), 100, 1, 0.92);

function Simulation() {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  //add Dots from array
  DOTS.forEach((d) => {
    d.draw(CTX);
    d.drawVelociy(CTX);
    d.drawAcceleration(CTX);
    d.gravity();
    d.accelerate();
    d.borderCollision();
    d.drawAcceleration(CTX);
    for (i = 0; i < DOTS.length; i++) {
      if (i != DOTS.indexOf(d)) {
        if (distanceBetweenCircles(d, DOTS[i]) < d.r + DOTS[i].r) {
          console.log("collision");
        }
      }
    }
  });

  
  requestAnimationFrame(Simulation);
}
requestAnimationFrame(Simulation);
