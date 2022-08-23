//2D engine for games

const CANVAS = document.getElementById("canvas");
const CTX = canvas.getContext("2d");
const WINDOW = window;

//hold your dots
let DOTS = [];

class Dot {
    constructor(x, y, mass, color) {
      this.x = x;
      this.y = y;
      this.r = 20;
      this.mass = mass
      this.v = new Vector(0, 0);
      this.a = new Vector(0, 0);
      this.color = color;
      DOTS.push(this);
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

    gravity(gravity) {
        this.a.add(gravity);
    }

    drawVelociy(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.v.x * 10, this.y + this.v.y *10);
        ctx.fillStyle = "black";
        ctx.stroke();
        ctx.closePath();
    }

    drawAcceleration(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.a.x * 10, this.y + this.a.y *10);
        ctx.fillStyle = "green";
        ctx.stroke();
        ctx.closePath();
    }
  
  
    //Drop the dot to the ground 
    drop() {
       //set acceleration 
       this.a = new Vector(0.3, 0.2);
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
}

function distanceBetweenCircles(d1, d2) {
    return Math.sqrt(Math.pow(d1.x - d2.x, 2) + Math.pow(d1.y - d2.y, 2));

}



function borderCollision(dot) {
  if (dot.x < dot.r || dot.x > CANVAS.width - dot.r) {
    dot.v.x *= -1;
  }
  if (dot.y < dot.r || dot.y > CANVAS.height - dot.r) {
    dot.v.y *= -1;
  }
}

let dot = new Dot(100, 100, 1, "red");
let dot2 = new Dot(200, 200, 1, "blue");


function Simulation() {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);


    //add Dots from array
    DOTS.forEach(d => {
        d.draw(CTX);
        d.drop();
        d.drawVelociy(CTX);
        d.drawAcceleration(CTX);
        borderCollision(d);
        for(i = 0; i < DOTS.length; i++) {
            if(i != DOTS.indexOf(d)) {
                if(distanceBetweenCircles(d, DOTS[i]) < d.r + DOTS[i].r) {
                    console.log("collision");
                }
            }
        }
    });
  requestAnimationFrame(Simulation);
}
requestAnimationFrame(Simulation);
