
/* global App, createElement */

App.KBoardBuilder = {

    xCharToButton: {},
    keyToEntity: {},
    wideKBoards: [],
    maxColsN: 0,
    tallKBoards: [],
    maxRowsN: 0,
    subMaxSectionsN: 0,

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

        var rowsN = 0;
        var sectionsN = 0;
        for (var s in data.order) {
            sectionsN++;
            var section = createElement("section");
            var sectionOrder = data.order[s];
            for (var r in sectionOrder) {
                rowsN++;
                var row = createElement("section", ["row"]);
                var rowOrder = sectionOrder[r];
                var colsN = rowOrder.length;
                this.checkForWide(kBoard, colsN);

                for (var k = 0; k < colsN; k++) {
                    row.appendChild(this.buildXLetterBox(rowOrder[k]));
                }
                section.appendChild(row);
            }
            kBoard.appendChild(section);
        }

        this.checkForTall(kBoard, rowsN, sectionsN);
        kBoard.backMap = this.xCharToButton;
        App.DomLandmarks.kBoards.push(kBoard);
        App.DomLandmarks.kBoardContainer.appendChild(kBoard);
    },

    buildXCharButtons: function (entity) {
        var xCharsN = entity.chars.length;
        for (var x = 0; x < xCharsN; x++) {
            var xChar = entity.chars[x];
            this.xCharToButton[xChar] = createElement(
                    "button",
                    ["xtext"],
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
                "p", ["roman"], null, [
                    createElement("i", null, null, [createTextNode(entity.roman)])
                ]
        ));

        var keySetToLayoutIds = {};
        var keySetsN = 0;
        for (var lId in App.Literator.layoutMaps) {
            var keySet = this.resolveKeys(App.Literator.layoutMaps[lId], entity.keys);
            if (keySetToLayoutIds[keySet]) {
                keySetToLayoutIds[keySet] += ',' + lId;
            } else {
                keySetToLayoutIds[keySet] = lId;
                keySetsN++;
            }
        }

        var layoutDependency = keySetsN > 1;
        var keySpans = [];
        for (var keySet in keySetToLayoutIds) {
            keySpans.push(
                    createElement(
                        "span",
                        null,
                        layoutDependency ? {"data-layout": keySetToLayoutIds[keySet]} : null,
                        [createTextNode(keySet)]
                    )
            );
        }

        box.appendChild(createElement(
                "p",
                ["keys", "typetext"].concat(
                        layoutDependency ? ["receiver-layout"] : []
                ),
                [["data-captions", "keys"]].concat(
                        layoutDependency ? [["data-depend-layout", "children"]] : []
                ),
                keySpans
        ));

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

        return preservedKeys.concat(addedKeys).join(' ');
    },

    checkForWide: function (kBoard, colsN) {
        if (colsN > this.maxColsN) {
            this.maxColsN = colsN;
            this.wideKBoards = [kBoard];
        } else if (colsN === this.maxColsN && this.wideKBoards.indexOf(kBoard) < 0) {
            this.wideKBoards.push(kBoard);
        }
    },

    checkForTall: function (kBoard, rowsN, sectionsN) {
        if (rowsN > this.maxRowsN || (rowsN === this.maxRowsN && sectionsN > this.subMaxSectionsN)) {
            this.maxRowsN = rowsN;
            this.subMaxSectionsN = sectionsN;
            this.tallKBoards = [kBoard];
        } else if (rowsN === this.maxRowsN && sectionsN === this.subMaxSectionsN
                && this.tallKBoards.indexOf(kBoard) < 0) {
            this.tallKBoards.push(kBoard);
        }
    }

};
