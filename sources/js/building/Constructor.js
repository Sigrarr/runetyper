
/* global App, Updater, getById */

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
    alphId: -1,
    layoutsData: [],
    layId: -1,

    run: function() {
        App.MenuBuilder.alphSelectLi = getById("selector-alphabet");
        if (App.Dev.std) {
            App.MenuBuilder.layoutSelectLi = getById("selector-layout");
            this.buildLayouts();
            this.buildAlphabets();
            this.buildKeyHeadSets();
        } else {
            App.KBoardBuilder.controlsProtos = getById("touch-controls").children;
            this.buildAlphabets();
        }
    },

    buildAlphabets: function () {
        var data;
        while ((data = this.alphabetsData.shift())) {
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

    buildAlphabet: function (data) {
        var id = ++this.alphId;
        var map = null;
        var genericXCharHandlerForEntity;

        if (App.Dev.std) {
            map = new this.AlphMap(data);
            App.Literator.alphMaps.push(map);

            genericXCharHandlerForEntity = function (newXCharIndex) {
                for (var k in this.keys) {
                    this.map[this.keys[k]] = this.chars[newXCharIndex];
                }
                App.DomSignaler.signalByXString(this.chars[newXCharIndex]);
            };
        } else {
            genericXCharHandlerForEntity = function (newXCharIndex) {
                App.DomSignaler.signalByXString(this.chars[newXCharIndex]);
            };
        }

        var multiXCharEntities = [];
        for (var eId in data.entities) {
            var entity = data.entities[eId];

            if (App.Dev.touch) {
                for (var ch in entity.chars) {
                    App.Literator.allChars[entity.chars[ch]] = true;
                }
            }

            if (entity.chars.length > 1) {
                var topicName = "xchar" + id + "_" + eId;

                entity.topicName = topicName;
                entity.map = map;
                entity[topicName + "Handler"] = genericXCharHandlerForEntity;

                Updater.startTopic(topicName);
                Updater.register(entity, topicName);
                multiXCharEntities.push(entity);
            }
        }

        App.MenuBuilder.addAlphabetEntry(data.meta, id);
        App.MenuBuilder.addXCharsEntry(multiXCharEntities, id);
        App.KBoardBuilder.buildAndAddKboard(data, id);
    },

    buildLayouts: function () {
        var data;
        while ((data = this.layoutsData.shift())) {
            this.buildLayout(data);
        }
    },

    buildLayout: function (data) {
        var id = ++this.layId;
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
                    if (key.length > 1 && layoutMap[key] !== null) {
                        set[key.charAt(0)] = true;
                    }
                }

                App.Literator.keyHeadSets[aId][lId] = set;
            }
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
