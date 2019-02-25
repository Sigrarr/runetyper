
/* global App, Env, findElement, createElement, createTextNode */

App.MenuBuilder = {

    alphIndicatorA: null,
    alphSelectUl: null,
    xCharSelectionLi: null,
    xCharIndicatorA: null,

    addAlphabetEntry: function (meta, id) {
        if (!this.alphIndicatorA || !this.alphSelectUl) {
            this.alphIndicatorA = findElement(".selector-alphabet").firstElementChild;
            this.alphSelectUl = findElement(".selector-alphabet").lastElementChild;
        }
        var name = meta.name[Env.lang];

        this.alphIndicatorA.appendChild(
                createElement("span", null, {"data-alphabet": id}, [
                    createTextNode(name)
                ])
        );

        this.alphSelectUl.appendChild(
                createElement("li", null, {"data-alphabet": id}, [
                    createElement("span", null, null, [createTextNode(name)]),
                    createTextNode(" "),
                    createElement("span", null, null, [createTextNode(meta.sample)])
                ])
        );
    },

    addXCharsEntry: function (entities, alphId) {
        if (!this.xCharSelectionLi || !this.xCharIndicatorA) {
            this.xCharSelectionLi = findElement(".selector-xchars");
            this.xCharIndicatorA = this.xCharSelectionLi.firstElementChild;
        }

        this.xCharIndicatorA.appendChild(
                createElement("span", null, {"data-alphabet": alphId}, [
                    createTextNode(entities.length)
                ])
        );

        if (entities.length === 0) {
            this.xCharIndicatorA.setAttribute("data-class-alphabet-" + alphId, "disabled");
            return;
        }

        var ul = createElement("ul", ["selector-xchar"], {"data-alphabet": alphId});

        for (var i in entities) {
            var entity = entities[i];
            var topicName = entity.topicName;
            var li = createElement("li");
            for (var ch in entity.chars) {
                li.appendChild(createElement(
                        "a",
                        ["receiver-" + topicName].concat(ch === 0 ? ["active"] : []),
                        [
                            ["href", "#"],
                            ["data-topic", topicName],
                            ["data-xchar", ch],
                            ["data-depend-" + topicName, "class"],
                            ["data-class-" + topicName + "-" + ch, "active"]
                        ],
                        [createTextNode(entity.chars[ch])]
                ));
            }

            ul.appendChild(li);
        }

        this.xCharSelectionLi.appendChild(ul);
    }

};
