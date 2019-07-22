
/* global App, newElement */

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
        var kBoard = newElement("div", ["kboard"], {"data-alphabet": alphId});

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
            var section = newElement("section");
            var sectionOrder = data.order[s];
            for (var r in sectionOrder) {
                rowsN++;
                var row = newElement("section", ["row"]);
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
        App.DomMarks.kBoards.push(kBoard);
        App.DomMarks.kBoardSpace.appendChild(kBoard);
    },

    buildXCharButtons: function (entity) {
        var xCharsN = entity.chars.length;
        for (var x = 0; x < xCharsN; x++) {
            var xChar = entity.chars[x];
            this.xCharToButton[xChar] = newElement(
                    "button",
                    ["xtext"],
                    [["data-xchar", xChar]]
                    .concat(
                            xCharsN > 1 ? [["data-" + entity.topicName, x]] : []
                    )
                    .concat(
                            x > 0 ? [["style", "display: none;"]] : []
                    ),
                    [newText(xChar)]
            );
        }
    },

    buildXLetterBox: function (key) {
        var entity = this.keyToEntity[key];
        var xCharsN = entity.chars.length;

        var box = newElement(
                "div",
                ["xletter-box"].concat(
                        xCharsN > 1 ? ["receiver-" + entity.topicName] : []
                ),
                xCharsN > 1 ? [["data-depend-" + entity.topicName, "children"]] : null
        );

        for (var x = 0; x < xCharsN; x++) {
            box.appendChild(this.xCharToButton[entity.chars[x]]);
        }

        var romans = entity.roman.split(' ');
        box.appendChild(newElement(
                "p", ["roman"], null, [
                    newElement("i", null, null, [
                        newElement("span", null, null, [newText(romans[0])])
                    ].concat(
                        romans.length > 1 ? [newText(" " + romans.slice(1).join(' '))] : []
                    ))
                ]
        ));

        if (App.stdDev()) {
            box.appendChild(this.buildKeysP(entity));
        }

        return box;
    },

    buildKeysP: function(entity) {
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
            var keys = keySet.split(' ');
            keySpans.push(
                    newElement(
                        "span",
                        null,
                        layoutDependency ? {"data-layout": keySetToLayoutIds[keySet]} : null,
                        [
                            newElement("span", null, null, [newText(keys[0])])
                        ].concat(
                                keys.length > 1 ? [newText(" " + keys.slice(1).join(' '))] : []
                        )
                    )
            );
        }

        return newElement(
                "p",
                ["keys", "typetext"].concat(
                        layoutDependency ? ["receiver-layout"] : []
                ),
                [["data-captions", "keys"]].concat(
                        layoutDependency ? [["data-depend-layout", "children"]] : []
                ),
                keySpans
        );
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
