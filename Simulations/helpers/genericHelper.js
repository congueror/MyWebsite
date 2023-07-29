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

let c = document.getElementById("main");
c.width = window.innerWidth;
c.height = window.innerHeight;
let ctx = c.getContext("2d");

let previousTimestamp;
let fun = null;

function setupAnim(drawFunction) {
    fun = drawFunction;
    window.requestAnimationFrame(main);
}

function main(timestamp) {
    window.requestAnimationFrame(main);

    if (previousTimestamp === undefined) {
        previousTimestamp = timestamp;
        window.requestAnimationFrame(main);
        return;
    }

    if (wasHidden) {
        previousTimestamp = timestamp;
        wasHidden = false;
    }

    window[fun](timestamp);
}