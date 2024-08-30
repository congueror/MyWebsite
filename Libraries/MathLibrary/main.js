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
/**
 * @type {Set<string>}
 */
var problemTags = new Set();
var problemsInPage = 5;
var page = 1;
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

    let problemsArray = [];
    DATA[language].forEach(o => {
        problemTags = problemTags.union(parseTags(o));
        problemsArray = problemsArray.concat(getAllProblems(o));
    });

    createTagSearchBar();

    let count = 0;
    for (let i = 0; i < problemsInPage; i++) {
        let pp = problemsArray[(page - 1) * problemsInPage];
        if (problemsArray[i])
            addProblem(problemsArray[i], count++);
    }

    createPageButtons(problemsArray);
}

function createTagSearchBar() {
    let body_div = document.getElementById('body_div');
    let problems = document.getElementById('problems');
    let s1 = document.createElement("h1");
    s1.innerHTML = `Search All Problems by Tag`;
    let s2 = document.createElement("input");
    s2.id = "searchbar";
    s2.className = "live_search";
    s2.setAttribute("onkeyup", "searchTag()");
    s2.type = "text";
    s2.name = "search";
    s2.placeholder = "Filter tags... Use &(AND) and |(OR) for more advanced filtering.";

    body_div.insertBefore(s1, problems);
    body_div.insertBefore(s2, problems);
}

function createPageButtons(arr) {
    let body_div = document.getElementById('body_div');
    let sDiv = document.createElement("div");
    sDiv.id = "page_div";
    sDiv.style.display = "flex";
    sDiv.style.alignItems = "center";
    sDiv.style.justifyContent = "center";
    sDiv.onchange = () => {
        problemsInPage = document.getElementById("problemsInPage").value;
        page = document.getElementById("page").value;
        document.getElementById("problems").innerHTML = "";

        let count = (page - 1) * problemsInPage;
        for (let i = 0; i < problemsInPage; i++) {
            let pp = arr[(page - 1) * problemsInPage + i];
            if (pp)
                addProblem(pp, count++);
        }

        MathJax.typeset();
    }

    let s1 = document.createElement("button");
    s1.className = "next_page";
    s1.style.backgroundImage = "url(../../icons/left_arrow.png)";
    s1.setAttribute("onclick", "nextPageClick(-1)");
    sDiv.appendChild(s1);

    let str = `Showing <input id="problemsInPage" type="number" value="5" min="1" max="$1" style="width:35px"/> problems in page <input id="page" type="number" value="1" min="1" max="$2" style="width:35px"/> of $2`;
    sDiv.insertAdjacentHTML("beforeend", str.replace("$1", arr.length).replaceAll("$2", Math.ceil(arr.length / 5)));

    let s2 = document.createElement("button");
    s2.className = "next_page";
    s2.setAttribute("onclick", "nextPageClick(1)");
    sDiv.appendChild(s2);

    body_div.appendChild(sDiv);
}

function searchTag() {
    let body = document.getElementById("body_div");
    let page = document.getElementById("page_div");
    let problems = document.getElementById("problems");
    let searchbar = document.getElementById("searchbar");
    let prompt = searchbar.value;
    
    let candidates = new Set();
    problemTags.forEach((t) => {
        if (t.includes(prompt)) {
            candidates.add(t);
        }
    });

    if (candidates.size === 0)
        return;

    let problemsArray = [];
    DATA[language].forEach(o => {
        if (prompt === '') {
            problemsArray = problemsArray.concat(getAllProblems(o));
            return;
        }
        problemsArray = problemsArray.concat(getAllProblems(o, [], (p) => {
            if (candidates.intersection(new Set(p.tags)).size !== 0) {
                return true;
            }
            return false;
        }));
    });

    problems.innerHTML = "";
    body.removeChild(page);

    let count = 0;
    for (let i = 0; i < problemsInPage; i++) {
        let pp = problemsArray[(page - 1) * problemsInPage];
        if (problemsArray[i])
            addProblem(problemsArray[i], count++);
    }

    createPageButtons(problemsArray);

    MathJax.typeset();
}

function nextPageClick(inc) {
    let sDiv = document.getElementById("page_div");
    let pp = document.getElementById("page");
    let num = Number.parseInt(pp.value) + inc;
    if (num <= pp.max && num >= pp.min)
        pp.value = num;
    sDiv.dispatchEvent(new Event("change"));
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

/**
 * 
 * @param {{id: string, title: string, subunits: Array, problems: Array.<{passage: string, solution: string, tags: Array.<string>}>}} o The object that will be parsed, including its subunits.
 * @param {Array.<{passage: string, solution: string, tags: Array.<string>}>} arr The array the values will be stored in, should be null.
 * @param {function({passage: string, solution: string, tags: Array.<string>}):Boolean} predicate
 * @returns {Array.<{passage: string, solution: string, tags: Array.<string>}>} All problems in the object provided including subunits
 */
function getAllProblems(o, arr, predicate) {
    if (!arr)
        arr = [];
    if (o.problems) {
        o.problems.forEach((p) => {
            if (!predicate || predicate(p))
                arr.push(p);
        });
    } else if (o.subunits) {
        o.subunits.forEach(p => {
            arr = getAllProblems(p, arr, predicate);
        });
    }
    return arr;
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

    if (o.tags) {
        let footer = document.createElement("footer");
        let tags = "";
        o.tags.forEach((s) => {
            tags += "#" + s;
        });
        footer.insertAdjacentText("beforeend", tags);
        footer.className = "problem_footer";
        div.appendChild(footer);
    }

    document.getElementById("problems").appendChild(div);
    document.getElementById("problems").appendChild(document.createElement("br"));
}