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

    calculateKineticEnergy() {
        return (this.mass * this.xVelocity * this.xVelocity) / 2;
    }

    collisionVelocity(cube) {
        let mA = this.mass, mB = cube.mass, uA = this.xVelocity, uB = cube.xVelocity;
        return (mA * uA + mB * (2 * uB - uA)) / (mA + mB);
    }

    isColliding(cube) {
        return this.isCollidingWithWall() || this.isCollidingWithCube(cube);
    }

    isCollidingWithWall() {
        return this.x < wall.x1 + 1;
    }

    isCollidingWithCube(cube) {
        return this.x + this.width >= cube.x && this.x <= cube.x + cube.width;
    }

    wallCollision() {
        if (this.isCollidingWithWall()) {
            this.x = wall.x1 + 1 + (wall.x1 + 1 - this.x);
            this.xVelocity *= -1;
            collisions++;

            return true;
        }
        return false;
    }

    cubeCollision(dx) {
        for (const c of cubes) {
            if (Object.is(c, this))
                continue;

            if ((this.x > c.x && this.x < c.x + c.width)) {
                let prevX = this.x - dx;
                let deltaX = prevX - (c.x + c.width);
                let deltaT = Math.abs(deltaX / this.xVelocity);
                let newVelocity = this.collisionVelocity(c);
                this.x = prevX + deltaX + newVelocity * Math.abs(dt - deltaT);

                c.xVelocity = newVelocity - c.xVelocity + this.xVelocity;
                c.x += c.xVelocity * Math.abs(dt - deltaT);

                this.xVelocity = newVelocity;

                collisions++;
                return true;
            } else if ((this.x < c.x && this.x + this.width > c.x)) {
                let prevX = this.x - dx;
                let deltaX = prevX + this.width - c.x;
                let deltaT = Math.abs(deltaX / this.xVelocity);
                let newVelocity = this.collisionVelocity(c);
                this.x = prevX + deltaX + newVelocity * Math.abs(dt - deltaT);

                c.xVelocity = newVelocity - c.xVelocity + this.xVelocity;
                c.x += c.xVelocity * Math.abs(dt - deltaT);

                this.xVelocity = newVelocity;

                collisions++;
                return true;
            }
        }
        return false;
    }

    move(dt) { //TODO: Fix this function
        let dx = this.xVelocity * dt;
        let dy = this.yVelocity * dt;

        this.x += dx;
        this.y += dy;

        let f1, f2;
        do {
            f1 = this.wallCollision();
            f2 = this.cubeCollision(dx);
        } while (f1 || f2);

        /*
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
                let deltaT = Math.abs(deltaX / this.xVelocity);
                let newVelocity = this.collisionVelocity(v);
                this.x = prevX + deltaX + newVelocity * Math.abs(dt - deltaT);

                v.xVelocity = newVelocity - v.xVelocity + this.xVelocity;
                v.x += v.xVelocity * Math.abs(dt - deltaT);

                this.xVelocity = newVelocity;

                collisions++;
            } else if ((this.x < v.x && this.x + this.width > v.x)) {
                let prevX = this.x - dx;
                let deltaX = prevX + this.width - v.x;
                let deltaT = Math.abs(deltaX / this.xVelocity);
                let newVelocity = this.collisionVelocity(v);
                this.x = prevX + deltaX + newVelocity * Math.abs(dt - deltaT);

                v.xVelocity = newVelocity - v.xVelocity + this.xVelocity;
                v.x += v.xVelocity * Math.abs(dt - deltaT);

                this.xVelocity = newVelocity;

                collisions++;
            }
        }*/
    }

    draw() {
        ctx.fillStyle = "#0291c7";

        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillText(`${this.mass}kg`, this.x, this.y - 10);
    }
}

let c = document.getElementById("main");
c.width = window.innerWidth - 64 - 17;
c.height = window.innerHeight - 6;
let ctx = c.getContext("2d");

{
    //let v_v = document.getElementById("velocity");
    //v_v.width = c.width / 2;
    //v_v.height = c.height / 2;
}

let mass1 = document.getElementById("mass1_input");
mass1.value = "100";
let mass2 = document.getElementById("mass2_input");
mass2.value = "1";
let vel1 = document.getElementById("vel1_input");
vel1.value = "-1";
let vel2 = document.getElementById("vel2_input");
vel2.value = "0";

const dt = 0.01;
const wall = new Wall(0, 10, 0, 3 * c.height / 4 + 1);

let intervalId;
let c1, c2, collisions;
let systemEnergy;

reset();

function reset() {
    if (intervalId)
        clearInterval(intervalId);

    c1 = new Cube(190, 3 * c.height / 4 - 41, 40, 40, Number(vel1.value), 0, Number(mass1.value));
    c2 = new Cube(80, 3 * c.height / 4 - 41, 40, 40, Number(vel2.value), 0, Number(mass2.value));
    collisions = 0;

    systemEnergy = c1.calculateKineticEnergy() + c2.calculateKineticEnergy();

    intervalId = setInterval(draw, 10);
}

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#36393F";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#c5ccd5";
    let fontSize = 20;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillText(`Collisions: ${collisions}`, c.width / 2 - fontSize - 126, 20 + fontSize);
    ctx.fillText(`Pi: ${Math.PI}...`, c.width / 2 - fontSize - 50, 40 + fontSize);

    ctx.strokeStyle = "#c5ccd5";
    ctx.beginPath();
    ctx.moveTo(0, 3 * c.height / 4);
    ctx.lineTo(c.width, 3 * c.height / 4);
    ctx.lineWidth = 2;
    ctx.stroke();

    wall.draw();

    //cubes.forEach(value => value.move(dt));

    let tickTime = 0; //TODO: Remove this copied code.
    while (1) {
        if (c2.xVelocity < 0) {
            let t = Math.abs(((c2.x) / c2.xVelocity));
            if (tickTime + t >= 1) {
                let delta = 1 - tickTime;
                c2.x += c2.xVelocity * delta;
                c1.x += c1.xVelocity * delta;
                break;
            } else {
                collisions++;
                tickTime += t;
                c2.x = 0;
                c1.x += c1.xVelocity * t;
                c2.xVelocity *= -1;
            }
        }

        let n = ((c2.x + c2.width) - c1.x) / (c1.xVelocity - c2.xVelocity);

        if (tickTime + n >= 1 || c2.xVelocity < c1.xVelocity) {
            let delta = 1 - tickTime;
            c2.x += c2.xVelocity * delta;
            c1.x += c1.xVelocity * delta;
            break;
        } else {
            collisions++;
            let dvv = (-2.0 * (c1.mass) * (c1.xVelocity - c2.xVelocity)) / (c1.mass + c2.mass);
            c2.xVelocity -= dvv;
            c1.xVelocity -= -1 * (dvv * (c2.mass / c1.mass));

            c1.x += c1.xVelocity * n;
            c2.x += c2.xVelocity * n;
            tickTime += n;
        }
    }

    c1.draw();
    c2.draw();

    ctx.save();
}