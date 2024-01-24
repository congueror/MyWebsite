const localizations = new Map([
    ["en_us", "English"],
    ["el_gr", "Greek"]
]);

function createWorker(content, onmessage) {
    let blobURL;
    blobURL = URL.createObjectURL(new Blob(content, {type: 'application/javascript'}));
    let worker = new Worker(blobURL);
    worker.onmessage = onmessage;
    URL.revokeObjectURL(blobURL);
    return worker;
}
