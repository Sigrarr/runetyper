
/* global Updater */

function newElement(tagName, classes, attributes, childNodes) {
    var element = document.createElement(tagName);

    if (Array.isArray(classes)) {
        for (var i in classes) {
            element.classList.add(classes[i]);
        }
    }

    if (Array.isArray(attributes)) {
        for (var p in attributes) {
            var pair = attributes[p];
            element.setAttribute(pair[0], pair[1]);
        }
    } else if (typeof attributes === "object") {
        for (var name in attributes) {
            element.setAttribute(name, attributes[name]);
        }
    }

    if (Array.isArray(childNodes)) {
        for (var i in childNodes) {
            element.appendChild(childNodes[i]);
        }
    }

    return element;
}

function newText(text) {
    return document.createTextNode(text);
}

function removeNode(node) {
    node.parentNode.removeChild(node);
    var classes = node.classList;
    if (classes) {
        for (var i = classes.length - 1; i >= 0; i--) {
            var parts = classes[i].split('-', 2);
            if (parts[0] === "receiver") {
                Updater.unregister(node, parts[1]);
            }
        }
    }
}

function getById(id) {
    return document.getElementById(id);
}

function getByClass(className) {
    return document.getElementsByClassName(className);
}

function getOneOf(className) {
    return getByClass(className)[0];
}

function findActiveChild(parent) {
    var children = parent.children;
    for (var i = 0; i < children.length; i++) {
        if (children[i].classList.contains("active")) {
            return children[i];
        }
    }
    return null;
}

function setProperties(object, properties) {
    for (var key in properties) {
        object[key] = properties[key];
    }
}
