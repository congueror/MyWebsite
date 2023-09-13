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
addData(customDefault);

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
            ["linear", "Linear Interpolation"],
            ["quadratic", "Quadratic Interpolation W.I.P."],
            ["cubic", "Cubic Interpolation"],
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
    } else if (data.type === "custom") {
        f.innerHTML += "<br> <div class='information'>?<span class='tooltip'> A void function responsible for drawing on the graph. Parameters: <code>ctx</code> -> The 2d context of the canvas, <code>data</code> -> The data passed in as a JSON, <code>graph</code> -> The graph instance. </span></div>";
        f.innerHTML += `<code>fun</code><span>: </span> <span class="js_text">function(ctx, data, graph) {</span> <br>`;
        f.innerHTML += `<textarea class="js_area" onchange="onSettingsChange(${dataIndex})" spellcheck="false"></textarea> <br>`;
        f.innerHTML += '<span class="js_text">}</span>';
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
        } else if (newData.type === "custom") {
            try {
                let fun = d.children[11].value.replaceAll('\n', ' ');
                newData.fun = new Function('ctx', 'data', 'graph', fun);

                dataObj = new Data(newData);
                dataObj.funText = newData.funText;
            } catch (e) {
                dataObj = customDefault;
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