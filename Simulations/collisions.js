class Wall {

    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    draw() {
        ctx.strokeStyle = "#c5ccd5";

        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Cube {
    constructor(x, y, width, height, xVelocity, yVelocity, mass) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
        this.mass = mass;
    }

    collisionVelocity(cube) {
        let mA = this.mass, mB = cube.mass, uA = this.xVelocity, uB = cube.xVelocity;
        return (mA * uA + mB * (2 * uB - uA)) / (mA + mB);
    }

    move(dt) {
        let dx = this.xVelocity * dt;
        let dy = this.yVelocity * dt;

        this.x += dx;
        this.y += dy;

        if (this.x === wall.x1 + 1) {
            this.xVelocity *= -1;
            collisions++;
        } else if (this.x < wall.x1 + 1) {
            this.x = wall.x1 + 1 + (wall.x1 + 1 - this.x);
            this.xVelocity *= -1;
            collisions++;
        }

        for (const v of cubes) {
            if (Object.is(v, this) || this.xVelocity === 0)
                continue;

            if (this.x === v.x + v.width) {
                let newVelocity = this.collisionVelocity(v);
                v.xVelocity = newVelocity - v.xVelocity + this.xVelocity;
                this.xVelocity = newVelocity;
                collisions++;
            } else if ((this.x > v.x && this.x < v.x + v.width)) {
                let prevX = this.x - dx;
                let deltaX = prevX - (v.x + v.width);
                let deltaT = deltaX / this.xVelocity;
                let newVelocity = this.collisionVelocity(v);
                this.x = prevX + this.xVelocity * deltaT + newVelocity * (dt - deltaT);

                v.xVelocity = newVelocity - v.xVelocity + this.xVelocity;
                v.x += v.xVelocity * (dt - deltaT);

                this.xVelocity = newVelocity;

                collisions++;
            } else if ((this.x < v.x && this.x + this.width > v.x)) {
                let prevX = this.x - dx;
                let deltaX = prevX + this.width - v.x;
                let deltaT = deltaX / this.xVelocity;
                let newVelocity = this.collisionVelocity(v);
                this.x = prevX + this.xVelocity * deltaT + newVelocity * (dt - deltaT);

                v.xVelocity = newVelocity - v.xVelocity + this.xVelocity;
                v.x += v.xVelocity * (dt - deltaT);

                this.xVelocity = newVelocity;

                collisions++;
            }
        }
    }

    draw() {
        ctx.fillStyle = "#0291c7";

        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillText(`${this.mass}kg`, this.x, this.y - 10);
    }
}

let c = document.getElementById("main");
c.width = window.innerWidth;
c.height = window.innerHeight;
let ctx = c.getContext("2d");

let wall = new Wall(39, 10, 39, 3 * c.height / 4 + 1);
let cubes = [
    new Cube(190, 3 * c.height / 4 - 41, 40, 40, -110, 0, 22),
    new Cube(80, 3 * c.height / 4 - 41, 40, 40, 0, 0, 1)
];

let dt = 0.01;
let id = setInterval(draw, 10);

let collisions = 0;

function draw() {
    ctx.fillStyle = "#36393F";
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#c5ccd5";
    let fontSize = 20;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillText(`Collisions: ${collisions}`, c.width / 2 - fontSize, 20 + fontSize);

    ctx.strokeStyle = "#c5ccd5";
    ctx.beginPath();
    ctx.moveTo(40, 3 * c.height / 4);
    ctx.lineTo(c.width, 3 * c.height / 4);
    ctx.lineWidth = 2;
    ctx.stroke();

    wall.draw();

    cubes.forEach(value => {
        value.move(dt);
        value.draw();
    });


    ctx.save();
}