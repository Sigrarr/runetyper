
/* global App, Env, findElement, createElement, createTextNode */

App.MenuBuilder = {

    alphIndicatorEm: null,
    alphSelectUl: null,
    xCharSelectLi: null,
    xCharIndicatorEm: null,
    layoutIndicatorEm: null,
    layoutSelectUl: null,

    addAlphabetEntry: function (meta, id) {
        if (!this.alphIndicatorEm || !this.alphSelectUl) {
            this.alphIndicatorEm = findElement(".selector-alphabet").children[1];
            this.alphSelectUl = findElement(".selector-alphabet").lastElementChild;
        }
        var name = meta.name[Env.lang];

        this.alphIndicatorEm.appendChild(
                createElement("span", null, {"data-alphabet": id}, [
                    createTextNode(name)
                ])
        );

        this.alphSelectUl.appendChild(
                createElement("li", null, {"data-alphabet": id}, [
                    createElement("button", null, {"data-alphabet": id}, [
                        createElement("span", null, null, [createTextNode(name)]),
                        createTextNode(" "),
                        createElement("span", null, null, [createTextNode(meta.sample)])
                    ])
                ])
        );
    },

    addXCharsEntry: function (entities, alphId) {
        if (!this.xCharSelectLi || !this.xCharIndicatorEm) {
            this.xCharSelectLi = findElement(".selector-xchars");
            this.xCharIndicatorEm = this.xCharSelectLi.children[1];
        }

        this.xCharIndicatorEm.appendChild(
                createElement("span", null, {"data-alphabet": alphId}, [
                    createTextNode(entities.length)
                ])
        );

        if (entities.length === 0) {
            this.xCharSelectLi.setAttribute("data-class-alphabet-" + alphId, "disabled");
            return;
        }

        var ul = createElement("ul", ["selector-xchar"], {"data-alphabet": alphId});

        for (var i in entities) {
            var entity = entities[i];
            var topicName = entity.topicName;
            var li = createElement("li");
            for (var ch in entity.chars) {
                li.appendChild(createElement(
                        "button",
                        ["receiver-" + topicName].concat(ch == 0 ? ["active"] : []),
                        [
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

        this.xCharSelectLi.appendChild(ul);
    },

    addLayoutEntry: function (meta, id) {
        if (!this.layoutIndicatorEm || !this.layoutSelectUl) {
            this.layoutIndicatorEm = findElement(".selector-layout").children[1];
            this.layoutSelectUl = findElement(".selector-layout").lastElementChild;
        }

        this.layoutIndicatorEm.appendChild(
                createElement("span", null, {"data-layout": id}, [createTextNode(meta.name)])
        );

        this.layoutSelectUl.appendChild(
                createElement("li", null, null, [
                    createElement("button", null, {"data-layout": id}, [createTextNode(meta.name)])
                ])
        );
    }

};
