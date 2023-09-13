class Graph {

    constructor(id, width, height, obj) {
        this.id = id;
        let div = document.getElementById(id);
        div.style = `width:${width}px; height:${height}px`;
        if (!div instanceof HTMLDivElement)
            throw `Element id of ${id} does not belong to a div element.`;

        let repeat = true;
        while (repeat) {
            repeat = false;
            for (const child of div.children) {
                div.removeChild(child);
                repeat = true;
            }
        }

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

        this.draw(div);
    }

    redraw() {
        let div = document.getElementById(this.id);
        let repeat = true;
        while (repeat) {
            repeat = false;
            for (const child of div.children) {
                div.removeChild(child);
                repeat = true;
            }
        }

        this.draw(div);
    }

    draw(element) {
        let c = document.createElement("canvas");
        c.width = this.width;
        c.height = this.height;
        c.style = "position:absolute;";
        element.appendChild(c);
        let ctx = c.getContext("2d");

        ctx.strokeStyle = "#676767";
        ctx.fillStyle = "#D3D3D3FF";
        ctx.font = "20px Verdana";
        ctx.lineWidth = 2;

        let baseWidth = ctx.measureText(9).width;
        let x, t, xAmount = (Math.abs(this.maxX) + Math.abs(this.minX)) / this.xIncrement;
        let xDec = xAmount - Math.trunc(xAmount);
        for (let i = 0; i <= xAmount; i++) {
            x = 50 + this.xCellSize * i;

            ctx.beginPath();
            ctx.moveTo(x, this.height - 40);
            ctx.lineTo(x, 40);
            ctx.stroke();

            t = this.minX + this.xIncrement * i;
            let xWidth = ctx.measureText(t).width;
            ctx.fillText(t, x - xWidth / 2, this.height - 20);
        }

        if (xDec > 0) {
            x = x + this.xCellSize * (xDec);

            ctx.beginPath();
            ctx.moveTo(x, this.height - 40);
            ctx.lineTo(x, 40);
            ctx.stroke();

            t = t + this.xIncrement * xDec;
            let xWidth = ctx.measureText(t).width;
            ctx.fillText(t, x - xWidth / 2, this.height - 20);
        }

        let y, yAmount = (Math.abs(this.maxY) + Math.abs(this.minY)) / this.yIncrement;
        for (let i = 0; i <= yAmount; i++) {
            y = this.height - 50 - this.yCellSize * i;

            ctx.beginPath();
            ctx.moveTo(40, y);
            ctx.lineTo(this.width - 40, y);
            ctx.stroke();

            t = this.minY + this.yIncrement * i;
            let yWidth = ctx.measureText(t).width;
            ctx.fillText(t, 20 - (yWidth - baseWidth), y + 7);
        }

        let yDec = yAmount - Math.trunc(yAmount);
        if (yDec > 0) {
            y = y - this.yCellSize * yDec;

            ctx.beginPath();
            ctx.moveTo(40, y);
            ctx.lineTo(this.width - 40, y);
            ctx.stroke();

            t = t + this.yIncrement * yDec;
            let yWidth = ctx.measureText(t).width;
            ctx.fillText(t, 20 - (yWidth - baseWidth), y + 7);
        }

        //Draw Axes
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;

        if (this.minX >= 0) {
            ctx.beginPath();
            ctx.moveTo(50, 40);
            ctx.lineTo(50, this.height - 40);
            ctx.stroke();
        } else {
            x = 50 + this.xCellSize * (Math.abs(this.minX) / this.xIncrement);

            ctx.beginPath();
            ctx.moveTo(x, 40);
            ctx.lineTo(x, this.height - 40);
            ctx.stroke();
        }

        if (this.minY >= 0) {
            ctx.beginPath();
            ctx.moveTo(40, this.height - 50);
            ctx.lineTo(this.width - 40, this.height - 50);
            ctx.stroke();
        } else {
            y = this.height - 50 - this.yCellSize * (Math.abs(this.minY) / this.yIncrement);

            ctx.beginPath();
            ctx.moveTo(40, y);
            ctx.lineTo(this.width - 40, y);
            ctx.stroke();
        }

        c = document.createElement("canvas");
        c.width = this.width;
        c.height = this.height;
        c.style = "position:absolute; ";
        element.appendChild(c);
        ctx = c.getContext("2d");

        for (const d in this.dataset) {
            try {
                if (this.dataset[d].type === "data") {
                    this.dataDraw(this.dataset[d], ctx);
                } else if (this.dataset[d].type === "function") {
                    this.functionDraw(this.dataset[d], ctx);
                } else if (this.dataset[d].type === "parametric_function") {
                    this.parametricFunctionDraw(this.dataset[d], ctx);
                } else if (this.dataset[d].type === "custom") {
                    this.dataset[d].fun(ctx, this.dataset[d], this);
                }
            } catch (e) {
                console.log(`There was an error loading dataset entry ${d} of type ${this.dataset[d].type}.\n` + e);
            }
        }

        ctx.clearRect(0, 0, this.width, 40);
        ctx.clearRect(0, 0, 50, this.height);
        ctx.clearRect(this.width - 40, 40, 40, this.height - 40);
        ctx.clearRect(40, this.height - 40, this.width - 40, 40);
    }

    getXPosition(x) {
        return 50 + this.xCellSize / this.xIncrement * (Math.abs(this.minX) + x);
    }

    getYPosition(y) {
        return this.height - 50 - this.yCellSize / this.yIncrement * (Math.abs(this.minY) + y);
    }

    dataDraw(data, ctx) {
        ctx.strokeStyle = data.color;
        ctx.lineWidth = 2;

        for (let i = 0; i < data.x.length; i++) {
            ctx.beginPath();
            ctx.arc(this.getXPosition(data.x[i]), this.getYPosition(data.y[i]), 5, 0, 2 * Math.PI);
            ctx.stroke();
        }

        switch (data.interpolation) {
            case "none":
                break;
            case "linear":
                this.dataLinearDraw(data, ctx);
                break;
            case "quadratic":
                this.dataQuadraticDraw(data, ctx);
                break;
            case "cubic":
                this.dataCubicDraw(data, ctx);
                break;
            case "polynomial":
                this.dataPolynomialDraw(data, ctx);
                break;
        }
    }

    dataLinearDraw(data, ctx) {
        ctx.beginPath();

        let x = this.getXPosition(data.x[0]);
        let y = this.getYPosition(data.y[0]);
        ctx.moveTo(x, y);
        for (let i = 1; i < data.x.length; i++) {
            x = this.getXPosition(data.x[i]);
            y = this.getYPosition(data.y[i]);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    dataQuadraticDraw(data, ctx) {
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
                domain: `[${x0},${x1}]`,
                color: data.color,
            });

            this.functionDraw(newData, ctx);
        }
    }

    dataCubicDraw(data, ctx) {
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
            values.set(0, (i - 1) * 4, a);
            values.set(0, (i - 1) * 4 + 1, b);
            values.set(0, (i - 1) * 4 + 2, 1);

            values.set(0, (i) * 4, -a);
            values.set(0, (i) * 4 + 1, -b);
            values.set(0, (i) * 4 + 2, -1);
            matrix.setRow(i + 2 * n - 1, values);
        }

        for (let i = 1; i < n; i++) {
            let x = data.x[i];
            let a = 6 * x;
            let values = new Matrix(1, matrix.columns);
            values.set(0, (i - 1) * 4, a);
            values.set(0, (i - 1) * 4 + 1, 2);

            values.set(0, (i) * 4, -a);
            values.set(0, (i) * 4 + 1, -2);
            matrix.setRow(i + (2 * n + n - 1) - 1, values);
        }

        matrix.set(4 * n - 2, 0, 6 * data.x[0]);
        matrix.set(4 * n - 2, 1, 2);
        matrix.set(4 * n - 1, 4 * n - 4, 6 * data.x[data.x.length - 1]);
        matrix.set(4 * n - 1, 4 * n - 3, 2);

        let gaussian = augmentMatrices(matrix, scalar);
        gaussian.print();
        let variables = gaussian.gaussianElimination();
        gaussian.print();
        variables.print();

        for (let i = 0; i < variables.rows / 4; i++) {
            let a = variables.get(4 * i, 0),
                b = variables.get(4 * i + 1, 0),
                c = variables.get(4 * i + 2, 0),
                d = variables.get(4 * i + 3, 0),
                x0 = data.x[i],
                x1 = data.x[i + 1];

            let newData = new Data({
                type: "function",
                fun: function (x) {
                    return a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
                },
                domain: `[${x0},${x1}]`,
                color: data.color,
            });

            this.functionDraw(newData, ctx);
        }
    }

    dataPolynomialDraw(data, ctx) {
        let n = data.x.length;
        let weights = [];
        for (let j = 0; j < n; j++) {
            let product = 1;
            for (let m = 0; m < n; m++) {
                if (j === m)
                    continue;
                product *= 1 / (data.x[j] - data.x[m]);
            }
            weights.push(product);
        }


        let newData = new Data({
            type: "function",
            fun: function (x) {
                let sum1 = 0, sum2 = 0;
                for (let i = 0; i < n; i++) {
                    sum1 += (weights[i] * data.y[i]) / (x - data.x[i]);
                    sum2 += weights[i] / (x - data.x[i]);
                }
                return sum1 / sum2;
            },
            domain: `[${data.x[0]},${data.x[n - 1]}]`,
            color: data.color,
        });

        this.functionDraw(newData, ctx);
    }

    functionDraw(data, ctx) {
        ctx.strokeStyle = data.color;
        ctx.lineWidth = 2;

        let domain = new Domain(data.domain);
        let minX = Math.max(this.minX, domain.min);
        let maxX = Math.min(this.maxX, domain.max);

        const d = 0.01;
        ctx.beginPath();
        let y = data.fun(minX);
        ctx.moveTo(this.getXPosition(minX), this.getYPosition(y));
        for (let x = minX; x < maxX; x += d) {
            y = data.fun(x);
            ctx.lineTo(this.getXPosition(x), this.getYPosition(y));
            if (y <= this.maxY && y >= this.minY) {

            } else {
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.getXPosition(x), this.getYPosition(y));
            }
        }
        ctx.stroke();
    }

    parametricFunctionDraw(data, ctx) {
        ctx.strokeStyle = data.color;
        ctx.lineWidth = 2;

        let domain = new Domain(data.domain);
        let minX = Math.max(this.minX, domain.min);
        let maxX = Math.min(this.maxX, domain.max);

        const d = data.parameterIncrement;
        ctx.beginPath();

        let x = data.x_fun(data.parameterMin);
        let y = data.y_fun(data.parameterMin);
        ctx.moveTo(this.getXPosition(x), this.getYPosition(y));
        let minT = data.parameterMin, maxT = data.parameterMax;
        for (let t = minT; t < maxT; t += d) {
            x = data.x_fun(t);
            y = data.y_fun(t);

            if (y <= this.maxY && y >= this.minY && x <= maxX && x >= minX) {
                ctx.lineTo(this.getXPosition(x), this.getYPosition(y));
            } else {
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.getXPosition(x), this.getYPosition(y));
            }
        }

        ctx.stroke();
    }
}

class Data {
    static DEFAULTS = {
        domain: `(${Number.NEGATIVE_INFINITY},${Number.POSITIVE_INFINITY})`,
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
            this.defaultAssign(obj, defaults, ["domain"]);
        }
        if (this.type === "parametric_function") {
            this.tryAssign(obj, ["x_fun", "y_fun", "parameterMin", "parameterMax"]);
            this.defaultAssign(obj, defaults, ["domain", "parameterIncrement"]);
        }
        if (this.type === "custom") {
            this.tryAssign(obj, ["fun"]);
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