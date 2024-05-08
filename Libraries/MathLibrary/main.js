function openMenu() {

}

function openLang() {

}

function getObjData(obj, id) {
    let arr = id.split(".");

    try {
        while (arr.length > 1) {
            obj = obj.filter((v) => v.id === arr[0])[0].subunits;
            arr.splice(0, 1);
        }
        return obj.filter((v) => v.id === arr[0])[0];
    } catch (e) {
        return undefined;
    }
}

var language = "en_us";
var params = new URLSearchParams(window.location.search);
var totalProblems = 0;
var wipProblems = 0;

let header = document.getElementById("header");
let id = params.get("id");
let obj;
if (params.has("id") && (obj = getObjData(DATA[language], id)) !== undefined) {
    header.innerHTML += `<h1>${obj.title}</h1>
        <div style="display: inline-block; background-color: #43388f; padding: 5px"><p >${obj.definition ? obj.definition : ''}</p></div>`;
    if (obj.subunits) {
        let depth = obj.id.split(".").length;
        obj.subunits.forEach(o => addContent(o, id, 0));
    }
    if (obj.problems) {
        obj.problems.forEach((o, i) => addProblem(o, i));
    }

    document.getElementById("progress").innerText = `${(totalProblems - wipProblems) / totalProblems * 100}%`;
} else
    fillDefault();


let list = document.getElementsByClassName("make_graph");
for (let item of list) {
    let width = item.parentElement.clientWidth / 4;
    if (item.hasAttribute("size"))
        width = Number.parseInt(item.getAttribute("size"));
    new Graph(item.id, width, width, window[item.getAttribute("options")]());
}

function fillDefault() {
    header.innerHTML += `<h1>Welcome to the Library of Mathematics</h1>
        <h2>A Collection of mathematical problems and concepts for easy access and easy practice.</h2>`;
    DATA[language].forEach(o => {
        addContent(o, "", 0);
    });

    let problems = document.getElementById('problems');
    problems.innerHTML += '<h1>Search All Problems by Tag</h1>';

}

function addContent(o, parent, depth, enumerate) {
    let title = document.createElement("h" + (depth + 2));
    title.id = parent === "" ? o.id : parent + "." + o.id;
    let a = document.createElement("a");

    let s = "";
    if (enumerate !== undefined) {
        s += enumerate + ". ";
    }
    s += o.title;
    a.innerHTML = s;
    a.href = createRootRedirectLink("Libraries/MathLibrary/index.html", "id=" + title.id);

    title.appendChild(a);

    if (depth > 0) {
        let contentDiv;
        if (document.getElementById(`${parent}#`)) {
            contentDiv = document.getElementById(`${parent}#`);
        } else {
            contentDiv = document.createElement("div");
            contentDiv.id = `${parent}#`
            contentDiv.className = "contentDiv";
        }
        contentDiv.style = `margin-left: ${(depth - 1) * 10}px`
        contentDiv.appendChild(title);

        let ind = parent.lastIndexOf('.');
        if (ind === -1)
            document.getElementById("content").appendChild(contentDiv);
        else
            document.getElementById(parent.substring(0, ind) + "#").appendChild(contentDiv);
    } else
        document.getElementById("content").appendChild(title);

    parent = title.id;
    depth++;
    if (depth === 1)
        enumerate = 0;
    if (depth === 2)
        enumerate = enumerate + '.0';
    for (const u in o.subunits) {
        if (typeof enumerate !== 'number') {
            let index = enumerate.lastIndexOf(".");
            let num = enumerate.substr(index + 1);
            enumerate = enumerate.substring(0, index) + '.' + ++num;
        } else
            enumerate++;

        addContent(o.subunits[u], parent, depth, enumerate);
    }
}

function addProblem(o, index) {
    totalProblems++;
    if (!o.passage) {
        wipProblems++;
    }

    let div = document.createElement("div");
    div.className = "solutionDiv";

    let passageDiv = document.createElement("div");
    let passage = document.createElement("p");
    passage.innerHTML = (index + 1) + ". " + o.passage;
    passageDiv.appendChild(passage);
    div.appendChild(passageDiv);

    let button = document.createElement("button");
    button.className = "solutionButton";
    button.innerText = lang[language].get("show_solution");
    button.onclick = (e) => {
        let s = e.target.parentElement.getElementsByClassName("solution")[0];
        s.hidden = !s.hidden
    }
    div.appendChild(button);

    let solution = document.createElement("p");
    solution.innerHTML = o.solution;
    solution.hidden = true;
    solution.className = "solution";
    div.appendChild(solution);

    document.getElementById("problems").appendChild(div);
    document.getElementById("problems").appendChild(document.createElement("br"));
}