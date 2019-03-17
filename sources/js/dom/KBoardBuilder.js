
/* global App, createElement */

App.KBoardBuilder = {

    xCharToButton: {},
    keyToEntity: {},

    buildAndAddKboard: function (data, alphId) {
        this.xCharToButton = {};
        this.keyToEntity = {};
        var kBoard = createElement("div", ["kboard"], {"data-alphabet": alphId});

        for (var e in data.entities) {
            var entity = data.entities[e];
            this.buildXCharButtons(entity);
            for (var k in entity.keys) {
                this.keyToEntity[entity.keys[k]] = entity;
            }
        }

        for (var s in data.order) {
            var section = createElement("section");
            var sectionOrder = data.order[s];
            for (var r in sectionOrder) {
                var row = createElement("section", ["row"]);
                var rowOrder = sectionOrder[r];
                for (var k in rowOrder) {
                    row.appendChild(this.buildXLetterBox(rowOrder[k]));
                }
                section.appendChild(row);
            }
            kBoard.appendChild(section);
        }

        kBoard.backMap = this.xCharToButton;
        App.KBoardProvider.kBoards.push(kBoard);
        App.KBoardProvider.container.appendChild(kBoard);
    },

    buildXCharButtons: function (entity) {
        var xCharsN = entity.chars.length;
        for (var x = 0; x < xCharsN; x++) {
            var xChar = entity.chars[x];
            this.xCharToButton[xChar] = createElement(
                "button",
                ["xchar"],
                [["data-xchar", xChar]]
                        .concat(
                            xCharsN > 1 ? [["data-" + entity.topicName, x]] : []
                        )
                        .concat(
                            x > 0 ? [["style", "display: none;"]] : []
                        ),
                [createTextNode(xChar)]
            );
        }
    },

    buildXLetterBox: function (key) {
        var entity = this.keyToEntity[key];
        var xCharsN = entity.chars.length;

        var box = createElement(
                "div",
                ["xletter-box"].concat(
                        xCharsN > 1 ? ["receiver-" + entity.topicName] : []
                ),
                xCharsN > 1 ? [["data-depend-" + entity.topicName, "children"]] : null
        );

        for (var x = 0; x < xCharsN; x++) {
            box.appendChild(this.xCharToButton[entity.chars[x]]);
        }

        box.appendChild(createElement(
                "p", ["trans"], null, [
                    createElement("i", null, null, [createTextNode(entity.trans)])
                ]
        ));

        var keysP = createElement(
                "p",
                ["keys", "receiver-layout"],
                {"data-subtitles": "keys", "data-depend-layout": "children"}
        );

        for (var i in App.Literator.layouts) {
            keysP.appendChild(createElement("span", null, {"data-layout": i}, [
                createTextNode(this.resolveKeys(App.Literator.layouts[i].map, entity.keys))
            ]));
        }

        box.appendChild(keysP);
        return box;
    },

    resolveKeys: function (layoutMap, uniKeys) {
        var preservedKeys = [];
        var addedKeys = [];

        for (var uk in uniKeys) {
            var uniKey = uniKeys[uk];
            var preserveUniKey = true;

            for (var mapKey in layoutMap) {
                var mapValue = layoutMap[mapKey];
                if (mapValue === null && mapKey === uniKey) {
                    preserveUniKey = false;
                } else if (mapValue === uniKey) {
                    addedKeys.push(mapKey);
                }
            }

            if (preserveUniKey) {
                preservedKeys.push(uniKey);
            }
        }

        return preservedKeys.concat(addedKeys).join(" ");
    }

};
