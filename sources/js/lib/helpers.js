
function createElement(tagName, classes, attributes, childNodes) {
    var element = document.createElement(tagName);

    if (Array.isArray(classes)) {
        for (var i in classes) {
            element.classList.add(classes[i]);
        }
    }

    if (typeof attributes === "object") {
        for (var name in attributes) {
            element.setAttribute(name, attributes[name]);
        }
    }

    if (typeof childNodes === "object" && typeof childNodes.length !== "undefined") {
        for (var i = 0; i < childNodes.length; i++) {
            element.appendChild(childNodes[i]);
        }
    }

    return element;
}

function createTextNode(text) {
    return document.createTextNode(text);
}

function findElement(query) {
    switch (query.substr(0, 1)) {
        case '.':
            return document.getElementsByClassName(query.substr(1))[0];
        case '#':
            return document.getElementById(query.substr(1));
        default:
            return document.getElementsByTagName(query)[0];
    }
}

function findMany(query) {
    switch (query.substr(0, 1)) {
        case '.':
            return document.getElementsByClassName(query.substr(1));
        default:
            return document.getElementsByTagName(query);
    }
}
