function createRootRedirectLink(loc, ...params) {

    if (!loc.startsWith('/'))
        loc = '/' + loc;
    location.pathname = loc;
}

function rootRedirect(loc, ...params) {
    createRootRedirectLink(loc, params);
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