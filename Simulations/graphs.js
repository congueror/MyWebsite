class Graph {

    constructor(id, width, height, obj) {
        let div = document.getElementById(id);
        div.width = width;
        div.height = height;
        if (!div instanceof HTMLDivElement)
            throw `Element id of ${id} does not belong to a div element.`;
        let c = document.createElement("canvas");
        c.width = width;
        c.height = height;
        div.appendChild(c);
        this.ctx = c.getContext("2d");

        this.width = width;
        this.height = height;
        this.xIncrement = obj.xIncrement;
        this.yIncrement = obj.yIncrement;
        this.maxX = obj.maxX;
        this.maxY = obj.maxY;
        this.minX = obj.minX;
        this.minY = obj.minY;

        this.dataset = [];
        obj.dataset.forEach(value => this.dataset.push(new Data(value)));

        let xAmount = (Math.abs(this.maxX) + Math.abs(this.minX)) / this.xIncrement;
        this.xCellSize = ((width - 40 - 50) / (xAmount));
        let yAmount = (Math.abs(this.maxY) + Math.abs(this.minY)) / this.yIncrement;
        this.yCellSize = ((height - 50 - 40) / (yAmount));

        if (obj.xIncrement > obj.maxX || obj.yIncrement > obj.maxY)
            throw 'Increment value cannot be greater than the maximum.';

        this.ctx.fillStyle = "#D3D3D3FF";
        this.ctx.font = "50px Verdana";
        this.ctx.fillText("Test | Work in Progress", 50, 50);
        this.draw();
    }

    draw() {
        this.ctx.strokeStyle = "#676767";
        this.ctx.fillStyle = "#D3D3D3FF";
        this.ctx.font = "20px Verdana";
        this.ctx.lineWidth = 2;

        let baseWidth = this.ctx.measureText(9).width;
        let x, t, xAmount = (Math.abs(this.maxX) + Math.abs(this.minX)) / this.xIncrement;
        for (let i = 0; i <= xAmount; i++) {
            x = 50 + this.xCellSize * i;

            this.ctx.beginPath();
            this.ctx.moveTo(x, this.height - 40);
            this.ctx.lineTo(x, 40);
            this.ctx.stroke();

            t = this.minX + this.xIncrement * i;
            let xWidth = this.ctx.measureText(t).width;
            this.ctx.fillText(t, x - xWidth / 2, this.height - 20);
        }

        let xDec = xAmount - Math.trunc(xAmount);
        if (xDec > 0) {
            x = x + this.xCellSize * (xDec);

            this.ctx.beginPath();
            this.ctx.moveTo(x, this.height - 40);
            this.ctx.lineTo(x, 40);
            this.ctx.stroke();

            t = t + this.xIncrement * xDec;
            let xWidth = this.ctx.measureText(t).width;
            this.ctx.fillText(t, x - xWidth / 2, this.height - 20);
        }

        let y, yAmount = (Math.abs(this.maxY) + Math.abs(this.minY)) / this.yIncrement;
        for (let i = 0; i <= yAmount; i++) {
            y = this.height - 50 - this.yCellSize * i;

            this.ctx.beginPath();
            this.ctx.moveTo(40, y);
            this.ctx.lineTo(this.width - 40, y);
            this.ctx.stroke();

            t = this.minY + this.yIncrement * i;
            let yWidth = this.ctx.measureText(t).width;
            this.ctx.fillText(t, 20 - (yWidth - baseWidth), y + 7);
        }

        let yDec = yAmount - Math.trunc(yAmount);
        if (yDec > 0) {
            y = y - this.yCellSize * yDec;

            this.ctx.beginPath();
            this.ctx.moveTo(40, y);
            this.ctx.lineTo(this.width - 40, y);
            this.ctx.stroke();

            t = t + this.yIncrement * yDec;
            let yWidth = this.ctx.measureText(t).width;
            this.ctx.fillText(t, 20 - (yWidth - baseWidth), y + 7);
        }

        //Draw Axes
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 2;

        if (this.minX >= 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(50, 40);
            this.ctx.lineTo(50, this.height - 40);
            this.ctx.stroke();
        } else {
            x = 50 + this.xCellSize * (Math.abs(this.minX) / this.xIncrement);

            this.ctx.beginPath();
            this.ctx.moveTo(x, 40);
            this.ctx.lineTo(x, this.height - 40);
            this.ctx.stroke();
        }

        if (this.minY >= 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(40, this.height - 50);
            this.ctx.lineTo(this.width - 40, this.height - 50);
            this.ctx.stroke();
        } else {
            y = this.height - 50 - this.yCellSize * (Math.abs(this.minY) / this.yIncrement);

            this.ctx.beginPath();
            this.ctx.moveTo(40, y);
            this.ctx.lineTo(this.width - 40, y);
            this.ctx.stroke();
        }

        for (const d in this.dataset) {
            if (this.dataset[d].type === "data") {
                switch (this.dataset[d].interpolation) {
                    case "linear":
                        this.dataLinearDraw(this.dataset[d]);
                        break;
                    case "quadratic":
                        this.dataQuadraticDraw(this.dataset[d]);
                        break;
                    case "cubic":
                        this.dataCubicDraw(this.dataset[d]);
                        break;
                }

            } else if (this.dataset[d].type === "function") {
                this.functionDraw(this.dataset[d]);
            } else if (this.dataset[d].type === "parametric_function") {
                this.parametricFunctionDraw(this.dataset[d]);
            }
        }
    }

    getXPosition(x) {
        return 50 + this.xCellSize / this.xIncrement * (Math.abs(this.minX) + x);
    }

    getYPosition(y) {
        return this.height - 50 - this.yCellSize / this.yIncrement * (Math.abs(this.minY) + y);
    }

    dataLinearDraw(data) {
        this.ctx.strokeStyle = data.color;
        this.ctx.lineWidth = 2;

        for (let i = 0; i < data.x.length; i++) {
            this.ctx.beginPath();
            this.ctx.arc(this.getXPosition(data.x[i]), this.getYPosition(data.y[i]), 5, 0, 2 * Math.PI);
            this.ctx.stroke();
        }

        this.ctx.beginPath();

        let x = this.getXPosition(data.x[0]);
        let y = this.getYPosition(data.y[0]);
        this.ctx.moveTo(x, y);
        for (let i = 1; i < data.x.length; i++) {
            x = this.getXPosition(data.x[i]);
            y = this.getYPosition(data.y[i]);
            this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
    }

    dataQuadraticDraw(data) {
        this.ctx.strokeStyle = data.color;
        this.ctx.lineWidth = 2;

        for (let i = 0; i < data.x.length - 2; i++) {
            let x0 = data.x[i], x1 = data.x[i + 1], x2 = data.x[i + 2];
            let y0 = data.y[i], y1 = data.y[i + 1], y2 = data.y[i + 2];

            let a0 = (y2 - y1) / (x2 - x1);
            let a1 = (y1 - y0) / (x1 - x0);
            let a = (a0 - a1) / (x2 - x0);
            let b = (y1 - y0) / (x1 - x0);
            let c = y0;

            let p = function (x) {
                return a * (x - x0) * (x - x1) + b * (x - x0) + c;
            }

            let newData = new Data({
                type: "function",
                fun: p,
                domainBottom: x0,
                domainTop: x1,
                color: data.color,
            });

            this.functionDraw(newData);
        }
    }

    dataCubicDraw(data) {
        if (data.x.length === 2) {
            this.dataLinearDraw(data);
            return;
        }

        this.ctx.strokeStyle = data.color;
        this.ctx.lineWidth = 2;

        for (let i = 0; i < data.x.length; i++) {
            this.ctx.beginPath();
            this.ctx.arc(this.getXPosition(data.x[i]), this.getYPosition(data.y[i]), 5, 0, 2 * Math.PI);
            this.ctx.stroke();
        }

        let n = data.x.length - 1;
        let matrix = new Matrix(4 * n, 4 * n);
        let scalar = new Matrix(4 * n, 1);

        for (let i = 0; i < n; i++) {
            let x1 = data.x[i], y1 = data.y[i],
                x2 = data.x[i + 1], y2 = data.y[i + 1];
            for (let j = 0; j < 4; j++) {
                matrix.set(2 * i, j + i * 4, Math.pow(x1, 3 - j));
                matrix.set(2 * i + 1, j + i * 4, Math.pow(x2, 3 - j));
                scalar.set(2 * i, 0, y1);
                scalar.set(2 * i + 1, 0, y2);
            }

        }

        for (let i = 1; i < n; i++) {
            let x = data.x[i];
            let a = 3 * x * x, b = 2 * x;
            let values = new Matrix(1, matrix.columns);
            values.set(0, (i-1)*4, a);
            values.set(0, (i-1)*4+1, b);
            values.set(0, (i-1)*4+2, 1);

            values.set(0, (i)*4, -a);
            values.set(0, (i)*4+1, -b);
            values.set(0, (i)*4+2, -1);
            matrix.setRow(i + 2 * n - 1, values);
        }

        for (let i = 1; i < n; i++) {
            let x = data.x[i];
            let a = 6 * x;
            let values = new Matrix(1, matrix.columns);
            values.set(0, (i-1)*4, a);
            values.set(0, (i-1)*4+1, 2);

            values.set(0, (i)*4, -a);
            values.set(0, (i)*4+1, -2);
            matrix.setRow(i + (2 * n + n - 1) - 1, values);
        }

        matrix.set(4*n-2, 0, 6 * data.x[0]);
        matrix.set(4*n-2, 1, 2);
        matrix.set(4*n-1, 4*n-4, 6 * data.x[data.x.length - 1]);
        matrix.set(4*n-1, 4*n-3, 2);

        let gaussian = augmentMatrices(matrix, scalar);
        gaussian.print();
        let variables = gaussian.gaussianElimination();
        gaussian.print();
        variables.print();

        for (let i = 0; i < variables.rows / 4; i++) {
            let a = variables.get(4*i, 0),
                b = variables.get(4*i+1, 0),
                c = variables.get(4*i+2, 0),
                d = variables.get(4*i+3, 0),
                x0 = data.x[i],
                x1 = data.x[i+1];

            let newData = new Data({
                type: "function",
                fun: function (x) {
                    return a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
                },
                domainBottom: x0,
                domainTop: x1,
                color: data.color,
            });

            this.functionDraw(newData);
        }
    }

    functionDraw(data) {
        this.ctx.strokeStyle = data.color;
        this.ctx.lineWidth = 2;

        let minX = Math.max(this.minX, data.domainBottom);
        let maxX = Math.min(this.maxX, data.domainTop);

        const d = 0.01;
        this.ctx.beginPath();
        let y = data.fun(minX);
        this.ctx.moveTo(this.getXPosition(minX), this.getYPosition(y));
        for (let x = minX; x < maxX; x += d) {
            y = data.fun(x);
            if (y <= this.maxY && y >= this.minY) {
                this.ctx.lineTo(this.getXPosition(x), this.getYPosition(y));
            } else {
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(this.getXPosition(x), this.getYPosition(y));
            }
        }
        this.ctx.stroke();
    }

    parametricFunctionDraw(data) {
        this.ctx.strokeStyle = data.color;
        this.ctx.lineWidth = 2;

        let minX = Math.max(this.minX, data.domainBottom);
        let maxX = Math.min(this.maxX, data.domainTop);

        const d = data.parameterIncrement;
        this.ctx.beginPath();

        let x = data.x_fun(data.parameterMin);
        let y = data.y_fun(data.parameterMin);
        this.ctx.moveTo(this.getXPosition(x), this.getYPosition(y));
        for (let t = data.parameterMin; t < data.parameterMax; t += d) {
            x = data.x_fun(t);
            y = data.y_fun(t);

            if (y <= this.maxY && y >= this.minY && x <= maxX && x >= minX) {
                this.ctx.lineTo(this.getXPosition(x), this.getYPosition(y));
            } else {
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(this.getXPosition(x), this.getYPosition(y));
            }
        }

        this.ctx.stroke();
    }
}

class Data {
    static DEFAULTS = {
        domainBottom: Number.NEGATIVE_INFINITY,
        domainTop: Number.POSITIVE_INFINITY,
        parameterIncrement: 0.01
    };

    constructor(obj, defaults) {
        if (defaults === undefined)
            defaults = {};

        this.type = obj.type;
        this.color = obj.color ? obj.color : "red";

        if (this.type === "data") {
            this.tryAssign(obj, ["interpolation", "x", "y"]);
        }
        if (this.type === "function") {
            this.tryAssign(obj, ["fun"]);
            this.defaultAssign(obj, defaults, ["domainBottom", "domainTop"]);
        }
        if (this.type === "parametric_function") {
            this.tryAssign(obj, ["x_fun", "y_fun", "parameterMin", "parameterMax"]);
            this.defaultAssign(obj, defaults, ["domainBottom", "domainTop", "parameterIncrement"]);
        }
    }

    tryAssign(obj, parameters) {
        for (const i in parameters) {
            const p = parameters[i];
            if (obj[p] === undefined)
                throw `mandatory property ${p} was not defined in data of type ${this.type}.`
            this[p] = obj[p];
        }
    }

    defaultAssign(obj, defaults, parameters) {
        for (const i in parameters) {
            const p = parameters[i];

            if (obj[p] === undefined) {
                if (defaults[p] === undefined)
                    this[p] = Data.DEFAULTS[p];
                else
                    this[p] = defaults[p];
            } else
                this[p] = obj[p];
        }
    }
}

new Graph("main", window.innerWidth - 64 - 17, window.innerHeight - 6, {
    xIncrement: 1,
    yIncrement: 1,
    maxX: 16,
    maxY: 16,
    minX: -16,
    minY: -16,
    dataset: [
        {
            type: "data",
            interpolation: "cubic",
            x: [1, 3, 5, 8],
            y: [2, 3, 9, 10],
            color: "#0090de"
        },
        {
            type: "function",
            fun: function (x) {
                return Math.sin(x);
            },
            domainBottom: -Math.PI,
            domainTop: Number.POSITIVE_INFINITY,
            color: "#00de04"
        },
        {
            type: "function",
            fun: function (x) {
                return Math.pow(Math.E, 2 * x);
            },
            color: "#ded300"
        },
        {
            type: "parametric_function",
            x_fun: function (t) {
                return Math.cos(t);
            },
            y_fun: function (t) {
                return Math.sin(t);
            },
            parameterMin: 0,
            parameterMax: 2 * Math.PI,
        }
    ]
});

/*
let m1 = createMatrix(
    [
        [2, 1, 3],
        [15, 2, 0],
        [1, 3, 1]
    ]
);
let m2 = createMatrix(
    [
        [10],
        [5],
        [3]
    ]
);

m1.print();
m2.print();

let m = augmentMatrices(m1, m2);
m.print();

let vars = m.gaussianElimination();
m.print();
vars.print();*/