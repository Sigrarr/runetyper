
/* global App, findMany, createTextNode */

App.fillEmail = function () {
    var mail = [
        'm', 'o', 'c', '.',
        'l', 'i', 'a', 'm', 'n', 'o', 't', 'o', 'r', 'p', '@',
        'i', 'k', 's', 'w', 'e', 'z', 's', 'a', 'n', 'a', 'b', '.',
        'r', 'o', 't', 'k', 'i', 'w'
    ].reverse().join('');
    var href = [':', 'o', 't', 'l', 'i', 'a', 'm'].reverse().join('') + mail;

    var as = findMany(".email");
    for (var i = 0; i < as.length; i++) {
        as[i].setAttribute("href", href);
        as[i].appendChild(createTextNode(mail));
    }
};
