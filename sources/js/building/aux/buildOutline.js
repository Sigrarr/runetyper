
/* global App, findOne, newElement, newText */

App.buildOutline = function (depth) {

    var buildSectionEntry = function (section, depth) {
        if (!(depth > 0
                && section.tagName.toLowerCase() === "section"
                && section.id
                && App.ViewController.isInfoSectionHash("#" + section.id, true))) {
            return null;
        }

        var sectionChildren = section.children;
        var sectionHeading = sectionChildren[0];
        var sectionHeadingTagName = sectionHeading.tagName.toLowerCase();
        if (sectionHeadingTagName.length !== 2 || sectionHeadingTagName.charAt(0) !== 'h') {
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

    var parentUl = findOne("#outline").children[1];
    var infoChildren = findOne(".long-text-content").children;

    for (var i = 0, entry = null; i < infoChildren.length; i++) {
        if ((entry = buildSectionEntry(infoChildren[i], depth))) {
            parentUl.appendChild(entry);
        }
    }
};
