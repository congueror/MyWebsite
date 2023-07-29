//Cross-browser compatibility for page visibility.
let hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Recent standards
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") { // IE 10 and IE 11
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") { // Chrome, Firefox, Opera, Safari
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

let isHidden = document[hidden], wasHidden = false;
window.addEventListener(visibilityChange, onVisibilityChange, false);

function onVisibilityChange() {
    wasHidden = isHidden;
    isHidden = document[hidden];
}