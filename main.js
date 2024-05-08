function createRootRedirectLink(loc, ...params) {
    let link = location.href;
    let main = "congueror.github.io/";
    let i = link.indexOf(main);
    let j = link.indexOf('?');

    let s1 = link.slice(0, i + main.length);
    let s2 = link.slice(i + main.length, j);
    let s3 = j === -1 ? "" : link.slice(j);

    let parameters = htmlParametersToMap(s3);
    if (parameters.has("_ijt")) {
        let newParameters = new Map();
        newParameters.set("_ijt", parameters.get("_ijt"));
        newParameters.set("_ij_reload", parameters.get("_ij_reload"));
        s3 = mapToHtmlParameters(newParameters);
    }

    if (params !== undefined) {
        for (const k in params) {
            let pair = params[k];
            if (pair.indexOf("=") === -1 || pair.indexOf("=") !== pair.lastIndexOf("="))
                continue;
            if (s3 === "")
                s3 = "?";
            if (s3 !== "?")
                s3 += "&";
            s3 += pair;
        }
    }

    return s1 + loc + s3;
}

function rootRedirect(loc, ...params) {
    location.href = createRootRedirectLink(loc, params);
}

function htmlParametersToMap(parameters) {
    if (parameters.charAt(0) === "?")
        parameters = parameters.slice(1);

    let map = new Map();
    let a = parameters.split("&");
    a.forEach(p => {
        let pair = p.split("=");
        map.set(pair[0], pair[1]);
    });
    return map;
}

function mapToHtmlParameters(map) {
    let string = "?";
    map.forEach((v, k) => {
        if (string !== "?")
            string += "&";
        string += k + "=" + v;
    });
    return string;
}