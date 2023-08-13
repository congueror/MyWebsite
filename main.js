function redirect(loc) {
    let link = location.href;
    let main = "congueror.github.io/";
    let i = link.indexOf(main);
    let j = link.indexOf('?');

    let s1 = link.slice(0, i + main.length);
    let s2 = link.slice(i + main.length, j);
    let s3 = link.slice(j);

    location.href = s1 + loc + s3;
}