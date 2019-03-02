
/* global App, Env, findOne, createElement, createTextNode */

App.MenuBuilder = {

    addAlphabetEntry: function (meta, id) {
        var alphIndicatorEm = findOne(".selector-alphabet").children[0].children[1];
        var alphSelectUl = findOne(".selector-alphabet").children[1];
        var name = meta.name[Env.lang];

        alphIndicatorEm.appendChild(
                createElement("span", null, {"data-alphabet": id}, [
                    createTextNode(name)
                ])
        );

        alphSelectUl.appendChild(
                createElement("li", null, null, [
                    createElement(
                            "button",
                            null,
                            [["data-topic", "alphabet"], ["data-alphabet", id]],
                            [
                                createElement("span", null, null, [createTextNode(name)]),
                                createTextNode(" "),
                                createElement("span", null, null, [createTextNode(meta.sample)])
                            ]
                    )
                ])
        );
    },

    addXCharsEntry: function (entities, alphId) {
        var xCharSelectLi = findOne(".selector-xchars");
        var xCharIndicatorEm = xCharSelectLi.children[0].children[1];

        xCharIndicatorEm.appendChild(
                createElement("span", null, {"data-alphabet": alphId}, [
                    createTextNode(entities.length)
                ])
        );

        if (entities.length === 0) {
            xCharSelectLi.setAttribute("data-class-alphabet-" + alphId, "disabled");
            return;
        }

        var ul = createElement("ul", ["selector-xchar"], {"data-alphabet": alphId});

        var xCharMassControlLi = xCharSelectLi.children[1].children[0];
        ul.appendChild(xCharMassControlLi.cloneNode(true));

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
                            ["data-" + topicName, ch],
                            ["data-depend-" + topicName, "class"],
                            ["data-class-" + topicName + "-" + ch, "active"]
                        ],
                        [createTextNode(entity.chars[ch])]
                ));
            }

            ul.appendChild(li);
        }

        xCharSelectLi.appendChild(ul);
    },

    addLayoutEntry: function (meta, id) {
        var layoutIndicatorEm = findOne(".selector-layout").children[0].children[1];
        var layoutSelectUl = findOne(".selector-layout").children[1];

        layoutIndicatorEm.appendChild(
                createElement("span", null, {"data-layout": id}, [createTextNode(meta.name)])
        );

        layoutSelectUl.appendChild(
                createElement("li", null, null, [
                    createElement(
                            "button",
                            null,
                            [["data-topic", "layout"], ["data-layout", id]],
                            [createTextNode(meta.name)]
                    )
                ])
        );
    }

};
