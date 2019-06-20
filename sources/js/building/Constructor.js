
/* global App, Updater */

App.Constructor = {

    AlphMap: function (data) {
        for (var e in data.entities) {
            var entity = data.entities[e];
            for (var k in entity.keys) {
                this[entity.keys[k]] = entity.chars[0];
            }
        }
    },

    alphabetsData: [],
    layoutsData: [],

    buildAlphabet: function (data) {
        var map = new this.AlphMap(data);
        var id = App.Literator.alphMaps.length;

        App.Literator.alphMaps.push(map);
        App.MenuBuilder.addAlphabetEntry(data.meta, id);

        var multiXCharEntities = [];
        for (var eId in data.entities) {
            if (data.entities[eId].chars.length > 1) {
                var entity = data.entities[eId];
                var topicName = "xchar" + id + "_" + eId;
                entity.topicName = topicName;
                entity.map = map;
                entity[topicName + "Handler"] = function (newXCharIndex) {
                    var newXChar = this.chars[newXCharIndex];
                    for (var k in this.keys) {
                        this.map[this.keys[k]] = newXChar;
                    }
                    App.DomSignaler.signalByXString(newXChar);
                };

                Updater.register(topicName, entity);
                multiXCharEntities.push(entity);
            }
        }

        App.MenuBuilder.addXCharsEntry(multiXCharEntities, id);
        App.KBoardBuilder.buildAndAddKboard(data, id);
    },

    buildLayout: function (data) {
        var id = App.Literator.layoutMaps.length;
        App.Literator.layoutMaps.push(data.map);
        App.MenuBuilder.addLayoutEntry(data.meta, id);
    },

    buildKeyHeadSets: function () {
        for (var aId = 0; aId < App.Literator.alphMaps.length; aId++) {
            var alphMap = App.Literator.alphMaps[aId];
            App.Literator.keyHeadSets[aId] = [];
            for (var lId = 0; lId < App.Literator.layoutMaps.length; lId++) {
                var layoutMap = App.Literator.layoutMaps[lId];
                var set = {};

                for (var key in alphMap) {
                    if (key.length > 1
                            && !(layoutMap.hasOwnProperty(key) && layoutMap[key] === null)) {
                        set[key.charAt(0)] = true;
                    }
                }

                App.Literator.keyHeadSets[aId][lId] = set;
            }
        }
    },

    buildAlphabets: function () {
        var data;
        while (data = this.alphabetsData.shift()) {
            this.buildAlphabet(data);
        }

        var wideKBoards = App.KBoardBuilder.wideKBoards;
        for (var d in wideKBoards) {
            wideKBoards[d].classList.add("wide");
        }

        var tallKBoards = App.KBoardBuilder.tallKBoards;
        for (var d in tallKBoards) {
            tallKBoards[d].classList.add("tall");
        }
    },

    buildLayouts: function () {
        var data;
        while (data = this.layoutsData.shift()) {
            this.buildLayout(data);
        }
    },

    enterAlphabets: function () {
        for (var i = 0; i < arguments.length; i++) {
            this.alphabetsData.push(arguments[i]);
        }
    },

    enterLayouts: function () {
        for (var i = 0; i < arguments.length; i++) {
            this.layoutsData.push(arguments[i]);
        }
    }

};
