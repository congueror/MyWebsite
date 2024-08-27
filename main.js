function createRootRedirectLink(loc, ...params) {

    if (!loc.startsWith('/'))
        loc = '/' + loc;

    let m = htmlParametersToMap(location.search);
    if (!params.includes("clearAll")) {
        params.forEach((v) => {
            let pair = v.split('=');
            m.set(pair[0], pair[1]);
        });
    } else {
        m.clear();
    }

    return location.origin + loc + mapToHtmlParameters(m);
}

function rootRedirect(loc, ...params) {
    location.href = createRootRedirectLink(loc, ...params);
}

function htmlParametersToMap(parameters) {
    if (parameters === "")
        return new Map();

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