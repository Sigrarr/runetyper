
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

    Layout: function (map) {
        this.map = map;
        this.normalize = function (rawInput) {
            return this.map.hasOwnProperty(rawInput) ? this.map[rawInput] : rawInput;
        };
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
                };

                Updater.register(topicName, entity);
                multiXCharEntities.push(entity);
            }
        }

        App.MenuBuilder.addXCharsEntry(multiXCharEntities, id);
        App.KBoardBuilder.buildAndAddKboard(data, id);
    },

    buildLayout: function (data) {
        var id = App.Literator.layouts.length;
        App.Literator.layouts.push(new this.Layout(data.map));
        App.MenuBuilder.addLayoutEntry(data.meta, id);
    },

    buildAlphabets: function () {
        var data;
        while (data = this.alphabetsData.shift()) {
            this.buildAlphabet(data);
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
