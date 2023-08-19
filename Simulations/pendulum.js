class Pendulum {

    constructor(x, y, length, angle, drawForceVectors, analyzeVectors) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.angle = toRads(angle);
        this.angularVelocity = 0;
        this.time = 0;
        this.initialAngle = Math.abs(this.angle);

        this.pendulum = null;
        this.drawForceVectors = drawForceVectors;
        this.analyzeVectors = analyzeVectors;
    }

    append(length, angle) {
        if (this.pendulum === null)
            this.pendulum = new Pendulum(this.x, this.y + this.length + 40, length, angle);
        else
            this.pendulum.append(length, angle);
    }

    f(theta) {
        return -(gravity / (this.length / 100)) * Math.sin(theta);
    }

    calculatePeriod() {
        let a = 2 * Math.PI * Math.sqrt(((this.length / 100) / gravity));
        let series = 0;
        for (let i = 0; i < 20; i++) {
            let num = factorial(2 * i);
            let den = Math.pow(2, i) * factorial(i);
            den *= den;

            let e1 = num / den;
            e1 *= e1;

            let e2 = Math.sin(this.initialAngle / 2);
            e2 = Math.pow(e2, 2 * i);

            series += e1 * e2;
        }
        return a * series;
    }

    move(dt) {
        let dTheta;
        let newAngularVelocity;

        let a = this.f(this.angle);
        let b = this.f(this.angle + (dt / 2) * a) * 2;
        let c = this.f(this.angle + (dt / 2) * b) * 2;
        let d = this.f(this.angle + dt * c);
        newAngularVelocity = this.angularVelocity + (dt / 6) * (a + b + c + d);

        dTheta = newAngularVelocity * dt;

        this.angle = this.angle + dTheta;
        this.time = this.time + dt;
        this.angularVelocity = newAngularVelocity;

        if (Math.abs(this.angle) > this.initialAngle) {
            this.angle = Math.sign(this.angle) * this.initialAngle;
        }

        if (this.pendulum != null) {
            this.pendulum.x = this.x + this.length * Math.sin(this.angle);
            this.pendulum.y = this.y + 20 + this.length * Math.cos(this.angle);
            this.pendulum.move(dt);
        }
    }

    draw() {
        ctx.fillStyle = "#0291c7";
        ctx.strokeStyle = "#0291c7";

        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.translate(-this.x, -this.y);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y + this.length + 20, 20, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.lineWidth = 0;
        ctx.stroke();

        let vectorSize = 200;
        if (this.drawForceVectors) {
            drawVector("T", this.x, this.y + this.length + 20, 0, -vectorSize * Math.cos(this.angle), "#ffdc00");

            if (this.analyzeVectors) {
                drawVector("Bε", this.x, this.y + this.length + 20, -vectorSize * Math.sin(this.angle), 0, "#22ff00");
                drawVector("Bκ", this.x, this.y + this.length + 20, 0, vectorSize * Math.cos(this.angle), "#22ff00");
            }

            ctx.translate(this.x, this.y + this.length + 20);
            ctx.rotate(this.angle);
            ctx.translate(-this.x, -(this.y + this.length + 20));
            drawVector("B", this.x, this.y + this.length + 20, 0, vectorSize, "#ffdc00");
        }

        ctx.resetTransform();

        ctx.fillStyle = "#0291c7";
        ctx.strokeStyle = "#0291c7";

        if (this.pendulum != null) {
            ctx.translate(this.pendulum.x, this.pendulum.y);
            ctx.rotate(-this.angle);
            ctx.translate(-this.pendulum.x, -this.pendulum.y);
            this.pendulum.draw();
        }
    }
}

let c = document.getElementById("main");
c.width = window.innerWidth - 64 - 17;
c.height = window.innerHeight;
let ctx = c.getContext("2d");

{
    let T_l = document.getElementById("period_length");
    T_l.width = c.width / 2;
    T_l.height = c.height / 2;

    let T_a = document.getElementById("period_angle");
    T_a.width = c.width / 2;
    T_a.height = c.height / 2;
}

let length = document.getElementById("length_input");
length.value = "200";
let angle = document.getElementById("angle_input");
angle.value = "45";
let draw_vectors = document.getElementById("draw_input");
draw_vectors.checked = true;
let analyze_vectors = document.getElementById("analyze_input");
analyze_vectors.checked = true;

const dt = 0.01;

let intervalId;
let p1;
let steps;

let oscillations;
let prevAngle;
let prevChange;
let theoreticalPeriod,
    experimentalPeriod,
    error,
    time;

reset();
period_length_graph();
period_angle_graph();

function reset() {
    if (intervalId)
        clearInterval(intervalId);

    p1 = new Pendulum(window.innerWidth / 2, 25, Number.parseInt(length.value), Number.parseInt(angle.value), draw_vectors.checked, analyze_vectors.checked);
    steps = 1;
    oscillations = 0;
    prevAngle = null;
    prevChange = 0;
    theoreticalPeriod = p1.calculatePeriod();
    experimentalPeriod = 0;

    intervalId = setInterval(draw, 10);
}

function draw() {
    if (prevAngle === null)
        prevAngle = p1.angle;

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#36393F";
    ctx.fillRect(0, 0, c.width, c.height);
    p1.move(dt);

    steps++;
    time = steps * dt;
    let change = p1.angle - prevAngle;
    if (Math.sign(prevChange) > 0 && Math.sin(change) < 0) {
        oscillations++;
        experimentalPeriod = time / oscillations;
    }

    if (oscillations === 0)
        experimentalPeriod = time;

    error = Math.abs(theoreticalPeriod - experimentalPeriod) / experimentalPeriod * 100;

    ctx.fillStyle = "#d3d3d3";
    let fontSize = 20;
    let x = 20;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillText(`Time Step: ${time.toFixed(2)}s`, x, 20);
    ctx.fillText(`Oscillations: ${oscillations}`, x, 40);
    ctx.fillText(`Experimental Period: ${experimentalPeriod.toFixed(5)}s`, x, 60);
    ctx.fillText(`Theoretical Period: ${theoreticalPeriod.toFixed(5)}s`, x, 80);
    ctx.fillText(`Percentile Error: ${error.toFixed(3)}%`, x, 100);

    p1.draw();
    ctx.save();

    prevAngle = p1.angle;
    prevChange = change;
}

function createChart(id, xValues, theoretical, experimental, error, title, subtitle) {
    return new Chart(id, {
        type: "line",
        data : {
            labels: xValues,
            datasets: [
                {
                    label: 'Theoretical Period',
                    data: theoretical,
                    borderColor: "red",
                    fill: false
                },
                {
                    label: 'Experimental Period',
                    data: experimental,
                    borderColor: "green",
                    fill: false
                },
                {
                    label: '%Error',
                    data: error,
                    borderColor: "blue",
                    fill: false
                }
            ]
        },
        options: {
            responsive: false,
            cubicInterpolationMode: 'monotone',
            layout: {
                padding: {
                    left: 20
                }
            },
            plugins: {
                title: {
                    text: title,
                    display: true,
                    color: '#E6E6FAFF'
                },
                subtitle: {
                    text: subtitle,
                    display: true,
                    color: '#E6E6FAFF'
                }
            }
        }
    });
}

function period_length_graph() {
    const xValues = [];
    const expYValues = [];
    const thYValues = [];
    const errorYValues = [];
    for (let i = 1; i < 10; i++) {
        xValues.push(i * 50);

        let pendulum = new Pendulum(0, 0, i * 50, Number.parseInt(angle.value), false, false);
        let T = pendulum.calculatePeriod();
        thYValues.push(T);

        let steps = 1, oscillations = 0, time, prevAngle = null, prevChange = 0, expPeriod = 0;
        do {
            if (prevAngle === null)
                prevAngle = pendulum.angle;

            pendulum.move(dt);

            steps++;

            time = steps * dt;
            let change = pendulum.angle - prevAngle;
            if (Math.sign(prevChange) > 0 && Math.sin(change) < 0) {
                oscillations++;
                expPeriod = time / oscillations;
            }

            prevAngle = pendulum.angle;
            prevChange = change;

        } while (oscillations < 50);

        expYValues.push(expPeriod);

        let error = Math.abs(T - expPeriod) / expPeriod * 100;
        errorYValues.push(error);
    }

    const chart = createChart("period_length", xValues, thYValues, expYValues, errorYValues,
        `Period/Length Graph with Percentage Error at 50 oscillations and θ=${angle.value}°`,
        'T=f(l)');
}

function period_angle_graph() {
    const xValues = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165];
    const expYValues = [];
    const thYValues = [];
    const errorYValues = [];
    for (let i = 0; i < xValues.length; i++) {
        let pendulum = new Pendulum(0, 0, Number.parseInt(length.value), xValues[i], false, false);
        let T = pendulum.calculatePeriod();
        thYValues.push(T);

        let steps = 1, oscillations = 0, time, prevAngle = null, prevChange = 0, expPeriod = 0;
        do {
            if (prevAngle === null)
                prevAngle = pendulum.angle;

            pendulum.move(dt);

            steps++;

            time = steps * dt;
            let change = pendulum.angle - prevAngle;
            if (Math.sign(prevChange) > 0 && Math.sin(change) < 0) {
                oscillations++;
                expPeriod = time / oscillations;
            }

            prevAngle = pendulum.angle;
            prevChange = change;

        } while (oscillations < 50);

        expYValues.push(expPeriod);

        let error = Math.abs(T - expPeriod) / expPeriod * 100;
        errorYValues.push(error);
    }

    const chart = createChart("period_angle", xValues, thYValues, expYValues, errorYValues,
        `Period/Angle Graph with Percentage Error at 50 oscillations and L=${length.value}u`,
        'T=f(θ)');
}
