function openMenu() {

}

function openLang() {

}

/**
 * 
 * @param {*} obj 
 * @param {string} id 
 * @returns {{id: string, title: string, problems: Array, subunits: Array}}
 */
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

fill();
addGraphs();

function fill() {
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
            for (let i = 0; i < obj.problems.length; i++) {
                let o = obj.problems[i];
                addProblem(o, i);
            }
        }

        document.getElementById("progress").innerText = `${(totalProblems - wipProblems) / totalProblems * 100}%`;
    } else
        fillDefault();
}

function addGraphs() {
    let list = document.getElementsByClassName("make_graph");
    for (let item of list) {
        let width = item.parentElement.clientWidth / 4;
        if (item.hasAttribute("size"))
            width = Number.parseInt(item.getAttribute("size"));
        new Graph(item.id, width, width, window[item.getAttribute("options")]());
    }
}

function fillDefault() {
    document.getElementById("header").innerHTML += `<h1>Welcome to the Library of Mathematics</h1>
        <h2>A Collection of mathematical problems and concepts for easy access and easy practice.</h2>`;
    DATA[language].forEach(o => {
        addContent(o, "", 0);
    });

    let problems = document.getElementById('problems');
    problems.innerHTML += '<h1>Search All Problems by Tag</h1>';

    problems.innerHTML += `<input id="searchbar" class="live_search" onkeyup="search_tag()" type="text" name="search" placeholder="Filter tags... Use &(AND) and |(OR) for more advanced filtering."> <br><br>`;

    let tags = new Set();
    let index = 0;
    DATA[language].forEach(o => {
        tags = tags.union(parseTags(o));
        index += addProblems(o, index);
    });

}

function parseTags(o) {
    let tags = new Set();
    if (o.problems) {
        o.problems.forEach(p => {
            if (p.tags)
                for (const t in p.tags)
                    tags.add(p.tags[t]);

        })
    } else if (o.subunits) {
        o.subunits.forEach(p => {
            tags = tags.union(parseTags(p));
        });
    }

    return tags;
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

/**
 * 
 * @param {{passage: string, solution: string, tags: Array.<string>}} o The problem object.
 * @param {number} index The number index displayed at the beginning of the problem.
 */
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

/**
 * 
 * @param {{id: string, title: string, subunits: Array, problems: Array.<{passage: string, solution: string, tags: Array.<string>}>}} o The object that will be parsed, including its subunits.
 * @param {number} index The starting index of the problems that will be generated.
 * @returns {number} Amount of problems added.
 */
function addProblems(o, index) {
    let i = 0;
    if (o.problems) {
        o.problems.forEach((p) => {
            i++;
            addProblem(p, index + i - 1);
        });
    } else if (o.subunits) {
        o.subunits.forEach(p => {
            i += addProblems(p, i + index);
        });
    }
    return i;
}