class Graph {
    static GRAPHS = new Map();

    constructor(id, width, height, options) {
        Graph.GRAPHS.set(id, this);

        this.id = id;
        let div = document.getElementById(this.id);
        div.style.width = `${width}px`;
        div.style.height = `${height + 20}px`;
        if (!div instanceof HTMLDivElement)
            throw `Element id of ${this.id} does not belong to a div element.`;

        this.width = width;
        this.height = height;
        this.dataset = [];
        if (options.dataset === undefined) {
            throw `Graph with id ${this.id} is missing the mandatory 'dataset' field in the options object.`;
        }
        options.dataset.forEach(value => this.dataset.push(new Data(value)));

        let infoY = height / 4;
        if (document.getElementById("information_popup") === null) {
            let info = document.createElement("span");
            info.id = "information_popup";
            info.className = "graph_info";
            info.style = `float: left; top: ${infoY}px; right: 0; 
            border: 2px solid #ffffff; border-radius: 5px; padding: 5px;
            display: block; position: fixed; background-color: #835353; z-index: 3; opacity: 0`;
            document.getElementsByTagName("BODY")[0].appendChild(info);
            //div.innerHTML += `<span id="information_popup" class="graph_info"
            //               style="float: left; top: ${infoY}px; right: 0;
            //               border: 2px solid #ffffff; border-radius: 5px; padding: 5px;
            //               display: block; position: fixed; background-color: #835353; z-index: 3; opacity: 0"></span>`
        }

        if (options.title !== undefined) {
            let b = document.createElement("b");
            b.innerHTML += options.title
            b.style.textAlign = "center";
            for (let i = 0; i < this.dataset.length; i++) {
                let x = width / 2 - (this.dataset.length / 2) * (30 + 10);
                let box = document.createElement("div");
                box.addEventListener("mouseover", (e) => {
                    Graph.GRAPHS.get(this.id).onInfoMouseOver(box, Graph.GRAPHS.get(this.id).dataset[i].desc);
                });
                box.addEventListener("mouseout", (e) => {
                    Graph.GRAPHS.get(this.id).onInfoMouseOut();
                });
                box.style.backgroundColor = this.dataset[i].color;
                box.style.left = x + "px";
                box.style.position = "relative";
                box.style.margin = "5px";
                box.style.border = "2px solid #ffffff";
                box.style.display = "inline-block";
                box.style.width = "30px";
                box.style.height = "15px";
                box.style.zIndex = "1";

                b.appendChild(box);
            }

            div.appendChild(b);
            div.appendChild(document.createElement("br"));
        }

        if (options.subtitle !== undefined)
            div.innerHTML += options.subtitle;

        if (options.axes === "auto" || options.axes === "symmetric") {
            let onlyData = true, noData = true;

            for (let i = 0; i < this.dataset.length; i++) {
                if (this.dataset[i].type !== "data") {
                    if (options.axes === "symmetric")
                        throw `Graph with id ${this.id} declared 'symmetric' axes in options, 
                                but 'symmetric' axes require that there only exist datasets of type 'data'. 
                                Remove any problematic datasets or change axes to 'auto'.`
                    onlyData = false;
                } else
                    noData = false;
            }

            if (noData || !onlyData) {
                this.xIncrement = 1;
                this.yIncrement = 1;
                this.maxX = 10;
                this.maxY = 10;
                this.minX = -10;
                this.minY = -10;
            } else {
                if (options.axes === "auto")
                    this.resolveAutoAxes(options);
                if (options.axes === "symmetric")
                    this.resolveSymmetricAxes(options);
            }

        } else if (options.axes === "manual") {
            this.xIncrement = options.xIncrement;
            this.yIncrement = options.yIncrement;
            this.maxX = options.maxX;
            this.maxY = options.maxY;
            this.minX = options.minX;
            this.minY = options.minY;

            if (options.xIncrement > options.maxX || options.yIncrement > options.maxY)
                throw `Graph with id ${this.id} has an increment value that is greater than the maximum.`;
        } else {
            throw `Graph with id ${this.id} is missing a valid value for 'axes' option. Check your spelling or declare the field.`
        }

        let xAmount = this.getXAmount();
        this.xCellSize = ((width - 40 - 50) / (xAmount));
        let yAmount = this.getYAmount();
        this.yCellSize = ((height - 50 - 40) / (yAmount));

        this.draw(div);
    }

    resolveAutoAxes(options) {
        this.xIncrement = 1;
        this.yIncrement = 1;

        let maxX = Number.NEGATIVE_INFINITY, minX = Number.POSITIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY,
            minY = Number.POSITIVE_INFINITY;

        for (let i = 0; i < options.dataset.length; i++) {
            if (options.dataset[i].type === "data") {
                let xIncrement = 1, yIncrement = 1;
                let sum = 0, k = 0;
                for (let j = 0; j < options.dataset[i].x.length; j++) {
                    if (options.dataset[i].x[j] > maxX)
                        maxX = options.dataset[i].x[j];
                    if (options.dataset[i].x[j] < minX)
                        minX = options.dataset[i].x[j];
                    if (j + 1 < options.dataset[i].x.length) {
                        sum += options.dataset[i].x[j + 1] - options.dataset[i].x[j];
                        k++;
                    }
                }
                sum /= k;
                xIncrement = Math.trunc(sum) + (Math.trunc(sum) - sum !== 0 ? 1 : 0);
                if (xIncrement > this.xIncrement)
                    this.xIncrement = xIncrement;
                sum = 0;
                k = 0;
                for (let j = 0; j < options.dataset[i].y.length; j++) {
                    if (options.dataset[i].y[j] > maxY)
                        maxY = options.dataset[i].y[j];
                    if (options.dataset[i].y[j] < minY)
                        minY = options.dataset[i].y[j];
                    if (j + 1 < options.dataset[i].y.length) {
                        sum += options.dataset[i].y[j + 1] - options.dataset[i].y[j];
                        k++;
                    }
                }
                maxY = Math.trunc(maxY) + (maxY - Math.trunc(maxY) > 0 ? 1 : 0);
                minY = Math.trunc(minY) + (minY - Math.trunc(minY) < 0 ? 1 : 0);
                sum /= k;
                yIncrement = Math.trunc(sum) + (Math.trunc(sum) - sum !== 0 ? 1 : 0);
                if (yIncrement > this.yIncrement)
                    this.yIncrement = yIncrement;

            }
        }

        this.maxX = maxX;
        this.maxY = maxY;
        this.minX = minX;
        this.minY = minY;
    }

    resolveSymmetricAxes(options) {
        this.yIncrement = 1;

        let maxY = Number.NEGATIVE_INFINITY, minY = Number.POSITIVE_INFINITY;
        let xNums = [];

        for (let i = 0; i < options.dataset.length; i++) {
            if (options.dataset[i].type === "data") {
                for (let j = 0; j < options.dataset[i].x.length; j++) {
                    xNums.push(options.dataset[i].x[j]);
                }

                let yIncrement = 1;
                let sum = 0, k = 0;
                for (let j = 0; j < options.dataset[i].y.length; j++) {
                    if (options.dataset[i].y[j] > maxY)
                        maxY = options.dataset[i].y[j];
                    if (options.dataset[i].y[j] < minY)
                        minY = options.dataset[i].y[j];
                    if (j + 1 < options.dataset[i].y.length) {
                        sum += options.dataset[i].y[j + 1] - options.dataset[i].y[j];
                        k++;
                    }
                }
                maxY = Math.trunc(maxY) + (maxY - Math.trunc(maxY) > 0 ? 1 : 0);
                minY = Math.trunc(minY) + (minY - Math.trunc(minY) < 0 ? 1 : 0);
                sum /= k;
                yIncrement = Math.trunc(sum) + (Math.trunc(sum) - sum !== 0 ? 1 : 0);
                if (yIncrement > this.yIncrement)
                    this.yIncrement = yIncrement;

            }
        }

        this.xElements = [...new Set(xNums.sort((a, b) => {
            return a - b
        }))];
        this.maxY = maxY;
        this.minY = minY;

        this.getXAmount = function () {
            return this.xElements.length - 1;
        }

        this.getXPosition = function (x) {
            return 50 + this.xCellSize * Math.abs(x);
        }

        for (let i = 0; i < this.dataset.length; i++) {
            for (let j = 0; j < this.dataset[i].x.length; j++) {
                this.dataset[i].x[j] = this.xElements.indexOf(this.dataset[i].x[j]);
            }
        }
    }

    onInfoMouseOver(element, desc) {
        let a = document.getElementById("information_popup");
        a.innerHTML = desc;

        a.style.opacity = `1`;
        MathJax.typeset();
    }

    onInfoMouseOut() {
        let a = document.getElementById("information_popup");
        a.style.opacity = '0';
    }

    redraw() {
        let div = document.getElementById(this.id);
        let a = document.getElementById("information_popup");
        a.style.opacity = '0';
        a.innerHTML = '';
        let repeat = true;
        while (repeat) {
            repeat = false;
            for (const child of div.children) {
                if (child.tagName !== "CANVAS")
                    continue;
                div.removeChild(child);
                repeat = true;
            }
        }

        this.draw(div);
    }

    draw(element) {//TODO: Fix increment
        let c = document.createElement("canvas");
        c.width = this.width;
        c.height = this.height;
        c.style = "position:absolute;top:20px";
        element.appendChild(c);
        let ctx = c.getContext("2d");

        ctx.strokeStyle = "#676767";
        ctx.fillStyle = "#D3D3D3FF";
        ctx.font = "10px Verdana";
        ctx.lineWidth = 2;

        let baseWidth = ctx.measureText(9).width;
        let x, t, xAmount = this.getXAmount();
        let xDec = xAmount - Math.trunc(xAmount);
        for (let i = 0; i <= xAmount; i++) {
            x = 50 + this.xCellSize * i;

            ctx.beginPath();
            ctx.moveTo(x, this.height - 40);
            ctx.lineTo(x, 40);
            ctx.stroke();

            t = this.minX === undefined ? this.xElements[i] : this.minX + this.xIncrement * i;
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

        let y, yAmount = this.getYAmount();
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

        if (this.minX === undefined || this.minX >= 0) {
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
        c.style = "position:absolute; top:20px";
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
        return 50 + this.xCellSize / this.xIncrement * Math.abs(x - this.minX);
    }

    getYPosition(y) {
        return this.height - 50 - this.yCellSize / this.yIncrement * Math.abs(y - this.minY);
    }

    getXAmount() {
        return (this.maxX - this.minX) / this.xIncrement;
    }

    getYAmount() {
        return (this.maxY - this.minY) / this.yIncrement;
    }

    dataDraw(data, ctx) {
        ctx.strokeStyle = data.color;
        ctx.lineWidth = 1;

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

        //Evaluate @ known points
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

        //Continuity of 1st derivative at interior
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

        //Continuity of 2nd derivative at interior
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

        if (data.cubicType === "natural") {
            //Natural cubic assumption: P''(x) = 0 at exterior
            matrix.set(4 * n - 2, 0, 6 * data.x[0]);
            matrix.set(4 * n - 2, 1, 2);
            matrix.set(4 * n - 1, 4 * n - 4, 6 * data.x[data.x.length - 1]);
            matrix.set(4 * n - 1, 4 * n - 3, 2);
        } else if (data.cubicType === "clamped") {
            //Clamped cubic assumption: P'(x) = a at exterior.
            let a = 0;
            let x = data.x[0];
            matrix.set(4 * n - 2, 0, 3 * x * x);
            matrix.set(4 * n - 2, 1, 2 * x);
            matrix.set(4 * n - 2, 2, 1);
            //scalar.set(4 * n - 2, 0, a);
            x = data.x[data.x.length - 1];
            matrix.set(4 * n - 1, 4 * n - 4, 3 * x * x);
            matrix.set(4 * n - 1, 4 * n - 3, 2 * x);
            matrix.set(4 * n - 1, 4 * n - 2, 1);
            //scalar.set(4 * n - 1, 0, a);
        }

        let gaussian = augmentMatrices(matrix, scalar);
        let variables = gaussian.gaussianElimination();

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
                    if (x === data.x[i])
                        return data.y[i];

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

    dataMonotoneDraw(data, ctx) {

    }

    functionDraw(data, ctx) {
        ctx.strokeStyle = data.color;
        ctx.lineWidth = 2;

        let domain = new Domain(data.domain);
        let minX = Math.max(this.minX ?? 0, domain.min);
        let maxX = Math.min(this.maxX ?? this.getXAmount(), domain.max);

        const d = this.xIncrement === undefined ? 0.001 : 0.001 * this.xIncrement;
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

        let obj = {
            t: data.parameterMin,
            x: data.x_fun(data.parameterMin),
            y: data.y_fun(data.parameterMin),
        };

        if (data.animationInterval > 0) {
            var code = setInterval((ctx, obj, minT, maxT, minX, maxX, minY, maxY, d) => {

                if (obj.t >= maxT) {

                    clearInterval(code);
                    return;
                }

                obj.x = data.x_fun(obj.t);
                obj.y = data.y_fun(obj.t);

                if (obj.y <= maxY && obj.y >= minY && obj.x <= maxX && obj.x >= minX) {
                    ctx.lineTo(this.getXPosition(obj.x), this.getYPosition(obj.y));
                } else {
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(this.getXPosition(obj.x), this.getYPosition(obj.y));
                }

                ctx.stroke();

                obj.t += d;
            }, data.animationInterval, ctx, obj, minT, maxT, minX, maxX, this.minY, this.maxY, d);
        } else {
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
        }

        ctx.stroke();
    }

    destroy() {
        let a = document.getElementById(this.id);
        while (a.children.length !== 0)
            a.removeChild(a.firstElementChild);

        Graph.GRAPHS.delete(this.id);
    }
}

class Data {
    static DEFAULTS = {
        domain: `(${Number.NEGATIVE_INFINITY},${Number.POSITIVE_INFINITY})`,
        parameterIncrement: 0.01,
        animationInterval: 0,
        cubicType: "natural",
    };

    constructor(obj, defaults) {
        if (defaults === undefined)
            defaults = {};

        this.type = obj.type;
        this.color = obj.color ? obj.color : "red";

        if (this.type === "data") {
            this.tryAssign(obj, ["interpolation", "x", "y"]);
            if (obj.interpolation === "cubic")
                this.defaultAssign(obj, defaults, ["cubicType"]);
        }
        if (this.type === "function") {
            this.tryAssign(obj, ["fun"]);
            this.defaultAssign(obj, defaults, ["domain"]);
        }
        if (this.type === "parametric_function") {
            this.tryAssign(obj, ["x_fun", "y_fun", "parameterMin", "parameterMax"]);
            this.defaultAssign(obj, defaults, ["domain", "parameterIncrement", "animationInterval"]);
        }
        if (this.type === "custom") {
            this.tryAssign(obj, ["fun"]);
            this.allAssign(obj);
        }

        this.desc = obj.desc ? obj.desc : this.toMathJaxDescription();
    }

    allAssign(obj) {
        for (const p in Object.getOwnPropertyNames(obj)) {
            this[p] = obj[p];
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

    toMathJaxDescription() {
        let s = "";
        if (this.type === "data") {
            s += `<h3 style='color: ${this.color}'>Discrete Points</h3>`;
            let internal = '';
            if (this.interpolation === "cubic") {
                internal += `<b>Cubic Spline Interpolation</b>: <br> A piecewise function consisting of cubic equations for each set of data points such that
                        $$ g_i(x)=a_ix^3+b_ix^2+c_ix+d_i,\\ i=0,1,...,${this.x.length - 1}$$
                        $$ g(x)=g_i(x),\\ for\\ x \\in [${this.x[0]}, ${this.x[this.x.length - 1]}] $$
                        where the type <b>${this.cubicType}</b> defines the special conditions: `;
                if (this.cubicType === "natural") {
                    internal += `$$ g_i''(x)=0 \\implies 6a_ix+2b_i=0,\\ i=0,${this.x.length - 1} $$`;
                } else if (this.cubicType === "clamped") {
                    internal += `$$ g_i'(x)=0 \\implies 3a_ix^2+2b_ix+c_i=0,\\ i=0,${this.x.length - 1} $$`;
                }
            }
            if (this.interpolation === "polynomial") {
                let k = this.x.length - 1;
                internal += `<b>Lagrange Polynomial Interpolation</b>: <br> A global function that is the unique polynomial that interpolates the given data points. <br>
                        This polynomial is computed as shown: 
                        $$ Let\\ w_j=\\prod_{{0\\leq m\\leq ${k}}\\ {m\\neq j}}(x_j - x_m)^{-1} $$
                        $$ Then\\ L(x)=\\sum_{j=0}^{${k}}{\\frac{w_j}{x-x_j}y_j} / \\sum_{j=0}^{${k}}{\\frac{w_j}{x-x_j}} $$
                        `;
            }
            s += `<p>${internal}</p>`;
            //this.tryAssign(obj, ["interpolation", "x", "y"]);
            //if (obj.interpolation === "cubic")
            //    this.defaultAssign(obj, defaults, ["cubicType"]);
        }
        if (this.type === "function") {
            s += `<h3 style='color: ${this.color}'>Function</h3>`;
            //this.tryAssign(obj, ["fun"]);
            //this.defaultAssign(obj, defaults, ["domain"]);
        }
        if (this.type === "parametric_function") {
            s += `<h3 style='color: ${this.color}'>Parametric Function</h3>`;
            //this.tryAssign(obj, ["x_fun", "y_fun", "parameterMin", "parameterMax"]);
            //this.defaultAssign(obj, defaults, ["domain", "parameterIncrement"]);
        }
        if (this.type === "custom") {
            s += `<h3 style='color: ${this.color}'>Custom JS Script</h3>`;
            //this.tryAssign(obj, ["fun"]);
        }
        return s;
    }
}