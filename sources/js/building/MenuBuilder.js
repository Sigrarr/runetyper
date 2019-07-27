
/* global App, Env, newElement, newText */

App.MenuBuilder = {

    addAlphabetEntry: function (meta, id) {
        var parentLi = App.DomMarks.alphSelectLi;
        var indicatorEm = parentLi.children[0].children[1];
        var optionsUl = parentLi.children[1];
        var name = meta.name[Env.lang];

        indicatorEm.appendChild(
                newElement("span", null, {"data-alphabet": id}, [
                    newText(name)
                ])
        );

        optionsUl.appendChild(
                newElement("li", null, null, [
                    newElement(
                            "button",
                            ["receiver-alphabet"],
                            [
                                ["data-topic", "alphabet"],
                                ["data-alphabet", id],
                                ["data-depend-alphabet", "class"],
                                ["data-class-alphabet-" + id, "active"]
                            ],
                            [
                                newElement("span", null, null, [newText(name)]),
                                newText(" "),
                                newElement("span", ["xtext"], null, [newText(meta.sample)])
                            ]
                    )
                ])
        );
    },

    addXCharsEntry: function (entities, alphId) {
        var parentLi = App.DomMarks.xCharsSelectLi;
        var indicatorEm = parentLi.children[0].children[1];

        indicatorEm.appendChild(
                newElement("span", null, {"data-alphabet": alphId}, [
                    newText(entities.length)
                ])
        );

        if (entities.length === 0) {
            parentLi.setAttribute("data-class-alphabet-" + alphId, "disabled");
            return;
        }

        var ul = newElement("ul", ["selector-xchar"], {"data-alphabet": alphId});

        var massShiftLi = parentLi.children[1].children[0];
        ul.appendChild(massShiftLi.cloneNode(true));

        for (var i in entities) {
            var entity = entities[i];
            var topicName = entity.topicName;
            var li = newElement("li");
            for (var ch in entity.chars) {
                li.appendChild(newElement(
                        "button",
                        ["xtext", "receiver-" + topicName].concat(ch == 0 ? ["active"] : []),
                        [
                            ["data-topic", topicName],
                            ["data-" + topicName, ch],
                            ["data-depend-" + topicName, "class"],
                            ["data-class-" + topicName + "-" + ch, "active"]
                        ],
                        [newText(entity.chars[ch])]
                ));
            }

            ul.appendChild(li);
        }

        parentLi.appendChild(ul);
    },

    addLayoutEntry: function (meta, id) {
        var parentLi = App.DomMarks.layoutSelectLi;
        var optionsUl = parentLi.children[1];

        optionsUl.appendChild(
                newElement("li", null, null, [
                    newElement(
                            "button",
                            ["receiver-layout"],
                            [
                                ["data-topic", "layout"],
                                ["data-layout", id],
                                ["data-depend-layout", "class"],
                                ["data-class-layout-" + id, "active"]
                            ],
                            [newText(meta.name)]
                    )
                ])
        );
    }

};
