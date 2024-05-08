class Pendulum {

    constructor(x, y, length, angle, gravity, drawForceVectors, analyzeVectors) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.angle = toRads(angle);
        this.gravity = gravity;
        this.angularVelocity = 0;
        this.time = 0;
        this.initialAngle = Math.abs(this.angle);

        this.pendulum = null;
        this.drawForceVectors = drawForceVectors;
        this.analyzeVectors = analyzeVectors;
    }

    append(length, angle) {
        if (this.pendulum === null)
            this.pendulum = new Pendulum(this.x, this.y + this.length + 40, length, angle, this.gravity);
        else
            this.pendulum.append(length, angle);
    }

    angularAcceleration(theta) {
        return -(this.gravity / (this.length / 100)) * Math.sin(theta);
    }

    calculatePeriod() { // 2\\pi\\sqrt{(L/100)/g} * \\sum_{n=1}^{20} (\\frac{(2n)!}{(2^n*n!)^2})^2 * \\sin(\\frac{\\theta_0}{2})^{2n}
        let a = 2 * Math.PI * Math.sqrt((this.length / 100) / this.gravity);
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

    move(dt) {//TODO: Pre-calculation of movement.
        let dTheta;
        let newAngularVelocity;

        //Runge-Kutta Method
        let a = this.angularAcceleration(this.angle);
        let b = this.angularAcceleration(this.angle + (dt / 2) * a) * 2;
        let c = this.angularAcceleration(this.angle + (dt / 2) * b) * 2;
        let d = this.angularAcceleration(this.angle + dt * c);
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
            drawVector(ctx, "T", this.x, this.y + this.length + 20, 0, -vectorSize * Math.cos(this.angle), "#ffdc00");

            if (this.analyzeVectors) {
                drawVector(ctx, "Bε", this.x, this.y + this.length + 20, -vectorSize * Math.sin(this.angle), 0, "#22ff00");
                drawVector(ctx, "Bκ", this.x, this.y + this.length + 20, 0, vectorSize * Math.cos(this.angle), "#22ff00");
            }

            ctx.translate(this.x, this.y + this.length + 20);
            ctx.rotate(this.angle);
            ctx.translate(-this.x, -(this.y + this.length + 20));
            drawVector(ctx, "B", this.x, this.y + this.length + 20, 0, vectorSize, "#ffdc00");
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

let length = document.getElementById("length_input");
length.value = "200";
let angle = document.getElementById("angle_input");
angle.value = "45";
let g = document.getElementById("gravity_input");
g.value = GRAVITY;
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

let chartLength = null,
    chartAngle = null,
    chartGravity = null,
    chartMass = null;

//Chart.defaults.borderColor = '#676767';
//Chart.defaults.color = "#E6E6FAFF";

reset();

function reset() {
    if (angle.value > 180 || angle.value < 0) {
        angle.value = Math.abs(angle.value) % 180;
    }
    if (g.value < 0) {
        g.value = Math.abs(g.value);
    }
    if (length.value < 0) {
        length.value = Math.abs(length.value);
    }

    if (intervalId)
        clearInterval(intervalId);

    p1 = new Pendulum(window.innerWidth / 2, 60, Number.parseInt(length.value), Number.parseInt(angle.value), Number.parseFloat(g.value), draw_vectors.checked, analyze_vectors.checked);
    steps = 1;
    oscillations = 0;
    prevAngle = null;
    prevChange = 0;
    theoreticalPeriod = p1.calculatePeriod();
    experimentalPeriod = 0;

    intervalId = setInterval(draw, 10);

    period_length_graph();
    period_angle_graph();
    period_gravity_graph();
    period_mass_graph();
}

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#36393F";
    ctx.fillRect(0, 0, c.width, c.height);

    if (prevAngle === null)
        prevAngle = p1.angle;

    for (let i = 0; i < 100; i++)
        p1.move(dt / 100);

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

    prevAngle = p1.angle;
    prevChange = change;

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
}

function createChart(id, xValues, theoretical, experimental, error, title, subtitle) {
    return new Chart(id, {
        type: "line",
        data: {
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
            scales: {
                backgroundColor: '#E6E6FAFF'
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

function createGraph(id, xValues, theoretical, experimental, error, title) {
    return new Graph(id, c.width / 2, c.height / 2, {
        axes: "symmetric",
        title: title,
        dataset: [
            {
                type: "data",
                color: "#0090de",
                interpolation: "cubic",
                cubicType: "natural",
                x: [...xValues],
                y: theoretical,
                desc: `<h3 style='color: #E6E6FAFF'>Theoretical Period</h3>Theoretical period is calculated using 
                \\[ T= 2\\pi\\sqrt{\\frac{L/100}{g}} \\sum_{n=1}^{20} (\\frac{(2n)!}{(2^nn!)^2})^2 \\cdot \\sin(\\frac{\\theta_0}{2})^{2n} \\]`
            },
            {
                type: "data",
                color: "#de0000",
                interpolation: "cubic",
                cubicType: "natural",
                x: [...xValues],
                y: experimental,
                desc: `<h3 style='color: #E6E6FAFF'>Experimental Period</h3>Experimental period is calculated using the 
                time it takes for the simulation to execute 10 oscillations, \\( T=\\frac{t}{10} \\)`
            },
            {
                type: "data",
                color: "#4ade00",
                interpolation: "cubic",
                cubicType: "natural",
                x: [...xValues],
                y: error,
                desc: `<h3 style='color: #E6E6FAFF'>Error Percentile</h3>Error percentile between the experimental and theoretical period. It is calculated using
                the formula: \\[ \\%Error=\\frac{|T_{theoretical}-T_{experimental}|}{T_{experimental}}\\cdot 100 \\]`
            }
        ]
    });
}

function calculateChartValues(pendulum, thPeriods, expPeriods, errors) {
    let T = pendulum.calculatePeriod();
    thPeriods.push(T);


    let steps = 1, oscillations = 0, time, prevAngle = null, prevChange = 0, expPeriod = 0;
    do {
        if (prevAngle === null)
            prevAngle = pendulum.angle;

        let dt = 0.01;

        for (let i = 0; i < 100; i++)
            pendulum.move(dt / 100);

        steps++;

        time = steps * dt;
        let change = pendulum.angle - prevAngle;
        if (Math.sign(prevChange) > 0 && Math.sin(change) < 0) {
            oscillations++;
            expPeriod = time / oscillations;
        }

        prevAngle = pendulum.angle;
        prevChange = change;

    } while (oscillations < 10);

    expPeriods.push(expPeriod);

    let error = Math.abs(T - expPeriod) / expPeriod * 100;
    errors.push(error);
}

function period_length_graph() {
    const xValues = [];
    const expYValues = [];
    const thYValues = [];
    const errorYValues = [];

    for (let i = 1; i < 10; i++) {
        xValues.push(i * 50);

        let pendulum = new Pendulum(0, 0, i * 50, Number.parseInt(angle.value), Number.parseFloat(g.value), false, false);
        calculateChartValues(pendulum, thYValues, expYValues, errorYValues);
    }

    if (chartLength !== null) {
        chartLength.destroy();
        chartLength = null;
    }
    chartLength = createGraph("period_length", xValues, thYValues, expYValues, errorYValues,
        `$$\\color{#D3D3D3FF} T=f(l):\\ Period/Length\\ Graph\\ with\\ \\theta = ${angle.value}^\\circ,\\ g= ${g.value}\\frac{m}{s^2}$$`);
}

function period_angle_graph() {
    const xValues = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
    const expYValues = [0];
    const thYValues = [0];
    const errorYValues = [0];
    for (let i = 1; i < xValues.length - 1; i++) {
        let pendulum = new Pendulum(0, 0, Number.parseInt(length.value), xValues[i], Number.parseFloat(g.value), false, false);
        calculateChartValues(pendulum, thYValues, expYValues, errorYValues);
    }

    expYValues.push(0);
    thYValues.push(0);
    errorYValues.push(0);

    if (chartAngle !== null) {
        chartAngle.destroy();
        chartAngle = null;
    }
    chartAngle = createGraph("period_angle", xValues, thYValues, expYValues, errorYValues,
        `$$\\color{#D3D3D3FF} T=f(\\theta):\\ Period/Angle\\ Graph\\ with\\ L=${length.value}cm,\\ g=${g.value}\\frac{m}{s^2}$$`);
}

function period_gravity_graph() {
    const xValues = [0, 0.66, 1.62, 3.7, 8.87, GRAVITY, 10.44, 24.79, 274.20];
    const expYValues = [0];
    const thYValues = [0];
    const errorYValues = [0];
    for (let i = 1; i < xValues.length; i++) {
        let pendulum = new Pendulum(0, 0, Number.parseInt(length.value), Number.parseInt(angle.value), xValues[i], false, false);
        calculateChartValues(pendulum, thYValues, expYValues, errorYValues);
    }

    if (chartGravity !== null) {
        chartGravity.destroy();
        chartGravity = null;
    }
    chartGravity = createGraph("period_gravity", xValues, thYValues, expYValues, errorYValues,
        `$$\\color{#D3D3D3FF} T=f(g):\\ Period/Gravity\\ Graph\\ with\\ L=${length.value}cm,\\ θ=${angle.value}^\\circ $$`);
}

function period_mass_graph() {
    const xValues = [0];
    const expYValues = [];
    const thYValues = [];
    const errorYValues = [];

    let pendulum = new Pendulum(0, 0, Number.parseInt(length.value), Number.parseInt(angle.value), Number.parseFloat(g.value), false, false);
    calculateChartValues(pendulum, thYValues, expYValues, errorYValues);

    for (let i = 0; i < 5; i++) {
        xValues.push(Math.pow(10, i));
        thYValues.push(thYValues[0]);
        expYValues.push(expYValues[0]);
        errorYValues.push(errorYValues[0]);
    }

    if (chartMass !== null) {
        chartMass.destroy();
        chartMass = null;
    }
    chartMass = createGraph("period_mass", xValues, thYValues, expYValues, errorYValues,
        `$$\\color{#D3D3D3FF} T=f(m):\\ Period/Mass\\ Graph\\ with\\ L=${length.value}cm,\\ θ=${angle.value}^\\circ,\\ g=${g.value}\\frac{m}{s^2} $$`);
}
