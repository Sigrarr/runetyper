
/* global App, Env, findOne, createElement, createTextNode */

App.MenuBuilder = {

    addAlphabetEntry: function (meta, id) {
        var parentLi = App.MenuProvider.alphSelectLi;
        var indicatorEm = parentLi.children[0].children[1];
        var optionsUl = parentLi.children[1];
        var name = meta.name[Env.lang];

        indicatorEm.appendChild(
                createElement("span", null, {"data-alphabet": id}, [
                    createTextNode(name)
                ])
        );

        optionsUl.appendChild(
                createElement("li", null, null, [
                    createElement(
                            "button",
                            ["receiver-alphabet"],
                            [
                                ["data-topic", "alphabet"],
                                ["data-alphabet", id],
                                ["data-depend-alphabet", "class"],
                                ["data-class-alphabet-" + id, "active"]
                            ],
                            [
                                createElement("span", null, null, [createTextNode(name)]),
                                createTextNode(" "),
                                createElement("span", ["xtext"], null, [createTextNode(meta.sample)])
                            ]
                    )
                ])
        );
    },

    addXCharsEntry: function (entities, alphId) {
        var parentLi = App.MenuProvider.xCharsSelectLi;
        var indicatorEm = parentLi.children[0].children[1];

        indicatorEm.appendChild(
                createElement("span", null, {"data-alphabet": alphId}, [
                    createTextNode(entities.length)
                ])
        );

        if (entities.length === 0) {
            parentLi.setAttribute("data-class-alphabet-" + alphId, "disabled");
            return;
        }

        var ul = createElement("ul", ["selector-xchar"], {"data-alphabet": alphId});

        var massShiftLi = parentLi.children[1].children[0];
        ul.appendChild(massShiftLi.cloneNode(true));

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

        parentLi.appendChild(ul);
    },

    addLayoutEntry: function (meta, id) {
        var parentLi = App.MenuProvider.layoutSelectLi;
        var optionsUl = parentLi.children[1];

        optionsUl.appendChild(
                createElement("li", null, null, [
                    createElement(
                            "button",
                            ["receiver-layout"],
                            [
                                ["data-topic", "layout"],
                                ["data-layout", id],
                                ["data-depend-layout", "class"],
                                ["data-class-layout-" + id, "active"]
                            ],
                            [createTextNode(meta.name)]
                    )
                ])
        );
    }

};
