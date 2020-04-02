
/* global App, getById, newElement, newText */

App.buildOutline = function (depth) {

    var buildSectionEntry = function (section, depth) {
        if (!(depth > 0
                && section.tagName === "SECTION"
                && section.id
                && App.ViewController.isInfoSectionHash("#" + section.id, true))) {
            return null;
        }

        var sectionChildren = section.children;
        var sectionHeading = sectionChildren[0];
        if (sectionHeading.tagName.length !== 2 || sectionHeading.tagName.charAt(0) !== 'H') {
            return null;
        }

        var sectionLi = newElement("li", null, null, [
            newElement("a", null, {href: "#" + section.id}, [
                newText(sectionHeading.textContent)
            ])
        ]);

        var nestedSectionLis = [];
        for (var i = 1, nestedEntry = null; i < sectionChildren.length; i++) {
            if ((nestedEntry = buildSectionEntry(sectionChildren[i], depth - 1))) {
                nestedSectionLis.push(nestedEntry);
            }
        }

        if (nestedSectionLis.length > 0) {
            sectionLi.appendChild(newElement("ul", null, null, nestedSectionLis));
        }

        return sectionLi;
    };

    var parentUl = getById("outline").children[1];
    var infoChildren = getById("info-content").children;

    for (var i = 0, entry = null; i < infoChildren.length; i++) {
        if ((entry = buildSectionEntry(infoChildren[i], depth))) {
            parentUl.appendChild(entry);
        }
    }
};
