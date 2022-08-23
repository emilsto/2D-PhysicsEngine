//2D engine for games

const CANVAS = document.getElementById("canvas");
const CTX = canvas.getContext("2d");
const WINDOW = window;


class Dot {
    constructor(x, y, r, mass, color) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.mass = mass
      this.v = new Vector(0, 0);
      this.a = new Vector(0, 0);
      this.color = color;
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
  
  
    //Drop the dot to the ground 
    drop() {
       //set acceleration 
       this.a = new Vector(0, 0.2);
       //set velocity according to acceleration
       this.v = this.v.add(this.a.mul(this.a.mag()));
   
       //velocity added to current y position
       this.y += this.v.y;
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
}


function borderCollision(dot) {
  if (dot.x < dot.r || dot.x > CANVAS.width - dot.r) {
    dot.v.x *= -1;
  }
  if (dot.y < dot.r || dot.y > CANVAS.height - dot.r) {
    dot.v.y *= -1;
  }
}


let dot = new Dot(300, 300, 100, 1, "blue");
let acc = document.getElementById("acceleration");
let vel = document.getElementById("velocity");

function Simulation() {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  dot.draw(CTX);
    dot.setBounds(CANVAS);
    acc.innerText =  dot.a.y;
    vel.innerText = dot.v.y;

    borderCollision(dot);


  dot.drop();

  requestAnimationFrame(Simulation);
}

requestAnimationFrame(Simulation);
