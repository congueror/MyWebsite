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

        let xDec = xAmount - Math.trunc(xAmount);
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

let inputs = document.getElementsByTagName("input");
for (const e in inputs) {
    inputs[e].onchange = function () {
        onSettingsChange(-1)
    };
}

const graph = new Graph("main", window.innerWidth - 64 - 17, window.innerHeight - 6, {
    xIncrement: 2,
    yIncrement: 2,
    maxX: 14,
    maxY: 14,
    minX: -14,
    minY: -14,
    dataset: [
        {
            type: "data",
            color: "#0090de",
            interpolation: "polynomial",
            x: [1, 3, 5, 8],
            y: [2, 3, 9, 10],
        },
        {
            type: "function",
            color: "#0090de",
            fun: function (x) {
                return Math.pow(Math.E, x);
            },
        },
        {
            type: "parametric_function",
            color: "#0090de",
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

const dataDefault = new Data({
    type: "data",
    color: "#0090de",
    interpolation: "polynomial",
    x: [1, 3, 5, 8],
    y: [2, 3, 9, 10],
});
const functionDefault = new Data({
    type: "function",
    color: "#0090de",
    fun: function (x) {
        return Math.pow(Math.E, x);
    },
});
functionDefault.funText = "return Math.pow(Math.E, x);";
const parametricFunctionDefault = new Data({
    type: "parametric_function",
    color: "#0090de",
    x_fun: function (t) {
        return Math.cos(t);
    },
    y_fun: function (t) {
        return Math.sin(t);
    },
    parameterMin: 0,
    parameterMax: 2 * Math.PI,
});
parametricFunctionDefault.xFunText = "return Math.cos(t);";
parametricFunctionDefault.yFunText = "return Math.sin(t);";
const customDefault = new Data({
    type: "custom",
    color: "#0090de",
    fun: function (ctx, data, graph) {

    }
});


addData(dataDefault);
addData(functionDefault);
addData(parametricFunctionDefault);

function addData(data) {
    let s = document.getElementById("datasets");
    let dataIndex = s.children.length;

    let f = document.createElement("div");
    f.className = "function";

    f.innerHTML += "<span class='math'>f</span> <code>type</code>: ";

    createSelection(f, dataIndex, [
        ["data", "Discrete Points"],
        ["function", "Function"],
        ["parametric_function", "Parametric Function"],
        ["custom", "Custom JS Script"],
    ], data.type, "Type");

    f.innerHTML += ` <code>color</code>: <input type='color' value="${data.color}" onchange="onSettingsChange(${dataIndex})">`;

    fillDataType(data, f, dataIndex);

    s.appendChild(f);
}

function fillDataType(data, f, dataIndex) {
    if (data.type === "data") {
        f.innerHTML += "<br> <div class='information'>?<span class='tooltip'> Interpolation is the mathematical method of creating a function that connects discrete points. </span></div>";
        f.innerHTML += "<code>interpolation</code><span>: </span>";

        createSelection(f, dataIndex, [
            ["none", "No Interpolation"],
            ["linear", "Linear"],
            ["quadratic", "Quadratic with Gaussian Elimination W.I.P."],
            ["cubic", "Cubic with Gaussian Elimination"],
            ["polynomial", "Lagrange Polynomial"],
        ], data.interpolation, "Interpolation");

        f.innerHTML += "<br> <div class='information'>?<span class='tooltip'> The collection of data points as x and y values (one on each line). e.g. 3 -2 </span></div>";
        f.innerHTML += "<span>Data Points:</span> <br>";

        let coords = document.createElement("textarea");
        coords.cols = 10;
        coords.rows = 10;
        coords.onchange = function () {
            onSettingsChange(dataIndex)
        };
        for (let i = 0; i < data.x.length; i++) {
            coords.value += data.x[i] + " " + data.y[i];
            if (i !== data.x.length - 1)
                coords.value += "\r\n";
        }
        f.appendChild(coords);

        f.appendChild(document.createElement("br"));
    } else if (data.type === "function") {
        f.innerHTML += "<br> <div class='information'>?<span class='tooltip'> The equation in y=f(x) that will be displayed. f(x) is expressed as a javascript function with x as a number parameter. </span></div>";
        f.innerHTML += `<code>fun</code><span>: y = </span> <span class="js_text">function(x) {</span> <br>`; //TODO: JS Syntax
        f.innerHTML += `<textarea class="js_area" onchange="onSettingsChange(${dataIndex})" spellcheck="false">${data.funText}</textarea> <br>`;
        f.innerHTML += '<span class="js_text">}</span>';

        f.innerHTML += "<br> <div class='information'>?<span class='tooltip'> The domain of the function. </span></div>";
        f.innerHTML += `<span>Domain: </span> <input type='text' value='${data.domain}' onchange="onSettingsChange(${dataIndex})"> <span>`;
    } else if (data.type === "parametric_function") {
        f.innerHTML += "<br> <div class='information'>?<span class='tooltip'> The equation in x=f(t) that will be displayed where t is the common parameter between y and x. f(t) is expressed as a javascript function with t as a number parameter. </span></div>";
        f.innerHTML += `<code>x_fun</code><span>: x = </span> <span class="js_text">function(t) {</span> <br>`; //TODO: JS Syntax
        f.innerHTML += `<textarea class="js_area" onchange="onSettingsChange(${dataIndex})" spellcheck="false">${data.xFunText}</textarea> <br>`;
        f.innerHTML += '<span class="js_text">}</span>';

        f.innerHTML += "<br> <div class='information'>?<span class='tooltip'> The equation in y=f(t) that will be displayed where t is the common parameter between y and x. f(t) is expressed as a javascript function with t as a number parameter. </span></div>";
        f.innerHTML += `<code>y_fun</code><span>: y = </span> <span class="js_text">function(t) {</span> <br>`; //TODO: JS Syntax
        f.innerHTML += `<textarea class="js_area" onchange="onSettingsChange(${dataIndex})" spellcheck="false">${data.yFunText}</textarea> <br>`;
        f.innerHTML += '<span class="js_text">}</span>';

        f.innerHTML += "<br> <div class='information'>?<span class='tooltip'> The minimum value of the common parameter (t). </span></div>";
        f.innerHTML += `<span>Parameter Minimum Value: </span> <input type='text' value='${data.parameterMin}' onchange="onSettingsChange(${dataIndex})"> <span>`; //TODO: To domain

        f.innerHTML += "<br> <div class='information'>?<span class='tooltip'> The maximum value of the common parameter (t). </span></div>";
        f.innerHTML += `<span>Parameter Maximum Value: </span> <input type='text' value='${data.parameterMax}' onchange="onSettingsChange(${dataIndex})"> <span>`;

        f.innerHTML += "<br> <div class='information'>?<span class='tooltip'> The domain of the function. </span></div>";
        f.innerHTML += `<span>Domain: </span> <input type='text' value='${data.domain}' onchange="onSettingsChange(${dataIndex})"> <span>`;

        f.innerHTML += "<br> <div class='information'>?<span class='tooltip'> The scale of which the t values will be incremented by. </span></div>";
        f.innerHTML += `<span>Parameter Increment: </span> <input type='text' value='${data.parameterIncrement}' onchange="onSettingsChange(${dataIndex})"> <span>`;
    }
}

function createSelection(f, index, map, def, title) {
    let typesSelect = document.createElement("select");
    typesSelect.title = title;
    typesSelect.setAttribute("onchange", `onSettingsChange(${index})`);
    let types = new Map(map);

    types.forEach((v, k) => {
        let o = document.createElement("option");
        o.value = k;
        o.innerText = v;
        if (k === def)
            o.setAttribute("selected", "selected");
        typesSelect.appendChild(o);

    });
    f.appendChild(typesSelect);
}

async function onSettingsChange(dataIndex) {

    if (dataIndex === -1) {
        graph.xIncrement = Number.parseInt(document.getElementById("xIncrement").value);
        graph.yIncrement = Number.parseInt(document.getElementById("yIncrement").value);
        graph.maxX = Number.parseInt(document.getElementById("maxX").value);
        graph.maxY = Number.parseInt(document.getElementById("maxY").value);
        graph.minX = Number.parseInt(document.getElementById("minX").value);
        graph.minY = Number.parseInt(document.getElementById("minY").value);
    } else {
        let datasets = document.getElementById("datasets");
        let d = datasets.children[dataIndex];
        let newData = {}, dataObj = null;

        newData.type = d.children[2].value;
        newData.color = d.children[4].value;

        if (newData.type === "data") {
            try {
                newData.interpolation = d.children[9].value;
                let xy = d.children[14].value;
                xy = xy.replaceAll('\n', ' ');
                let decoded = await decodeCoordinates(xy);
                if (decoded === "error" || decoded[0].length !== decoded[1].length) {
                    return;
                }

                newData.x = decoded[0];
                newData.y = decoded[1];

                dataObj = new Data(newData);
            } catch (e) {
                dataObj = dataDefault;
            }
        } else if (newData.type === "function") {
            try {
                let functionValue = d.children[11].value.replaceAll('\n', ' ');
                newData.fun = new Function('x', functionValue);
                newData.funText = d.children[11].value;
                newData.domain = d.children[17].value;

                dataObj = new Data(newData);
                dataObj.funText = newData.funText;
            } catch (e) {
                dataObj = functionDefault;
            }
        } else if (newData.type === "parametric_function") {
            try {
                let xFunction = d.children[11].value.replaceAll('\n', ' ');
                let yFunction = d.children[20].value.replaceAll('\n', ' ');
                newData.x_fun = new Function('t', xFunction);
                newData.y_fun = new Function('t', yFunction);
                newData.xFunText = d.children[11].value;
                newData.yFunText = d.children[20].value;
                newData.parameterMin = Number.parseFloat(d.children[26].value);
                newData.parameterMax = Number.parseFloat(d.children[31].value);
                newData.domain = d.children[36].value;
                newData.parameterIncrement = Number.parseFloat(d.children[41].value);

                dataObj = new Data(newData);
                dataObj.xFunText = newData.xFunText;
                dataObj.yFunText = newData.yFunText;
            } catch (e) {
                dataObj = parametricFunctionDefault;
            }
        }

        for (let i = d.children.length - 1; i >= 5; i--) {
            d.removeChild(d.children[i]);
        }

        graph.dataset[dataIndex] = dataObj;

        d.children[2].setAttribute("value", newData.type);
        d.children[4].setAttribute("value", newData.color);
        fillDataType(dataObj, d, dataIndex);
    }

    graph.redraw();
}

function decodeCoordinates(xy) {
    return new Promise((resolve => {
        setTimeout(() => {
            resolve("error");
        }, 20)

        let x = [], y = [];

        while (xy.length > 0) {
            let temp = '', num = '', i = 0;
            while (temp !== ' ' && temp !== undefined) {
                num += xy[i];
                i++;
                temp = xy[i];
            }


            if (x.length === y.length)
                x.push(Number.parseFloat(num));
            else
                y.push(Number.parseFloat(num));

            xy = xy.substr(i + 1);
            i = 0;
        }

        resolve([x, y]);
    }));
}