/**
 * 
 * @param {string} loc Location to redirect to, excluding the root link.
 * @param  {...string} params The html parameters to be included in the link, pass "clear" to clear all parameters.
 * @returns {string} The link to be used as you like.
 */
function createRootRedirectLink(loc, ...params) {

    if (!loc.startsWith('/'))
        loc = '/' + loc;

    let m = new URLSearchParams(location.search);
    if (params.includes("clear")) {
        params.splice(params.indexOf("clear"),1);
        m = new URLSearchParams("");
    }

    params.forEach((v) => {
        let pair = v.split('=');
        m.set(pair[0], pair[1]);
    });

    return location.origin + loc + "?" + m.toString();
}

/**
 * Redirects user to the provided location. See {@link createRootRedirectLink}
 * @param {string} loc Location to redirect to, excluding the root link.
 * @param  {...string} params The html parameters to be included in the link, pass "clear" to clear all parameters.
 */
function rootRedirect(loc, ...params) {
    location.href = createRootRedirectLink(loc, ...params);
}

//function htmlParametersToMap(parameters) {
//    if (parameters === "")
//        return new Map();
//
//    if (parameters.charAt(0) === "?")
//        parameters = parameters.slice(1);
//
//    let map = new Map();
//    let a = parameters.split("&");
//    a.forEach(p => {
//        let pair = p.split("=");
//        map.set(pair[0], pair[1]);
//    });
//    return map;
//}
//
//function mapToHtmlParameters(map) {
//    let string = "?";
//    map.forEach((v, k) => {
//       if (string !== "?")
//           string += "&";
//       string += k + "=" + v;
//    });
//    return string;
//}