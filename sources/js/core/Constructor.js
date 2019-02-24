
/* global App, Updater */

App.Constructor = {

    AlphMap: function (data) {
        for (var e in data.entities) {
            var entity = data.entities[e];
            for (var k in entity.keys) {
                this[entity.keys[k]] = entity.chars[0];
            }
        }
        this[' '] = ' ';
    },

    Layout: function (map) {
        this.map = map;
        this.normalize = function (rawInput) {
            return this.map.hasOwnProperty(rawInput) ? this.map[rawInput] : rawInput;
        };
    },

    enterAlphabet: function (data) {
        var map = new this.AlphMap(data);
        var id = App.Literator.alphMaps.length;
        App.Literator.alphMaps.push(map);

        var multiXCharEntities = [];
        for (var e in data.entities) {
            if (data.entities[e].chars.length > 1) {
                multiXCharEntities.push(data.entities[e]);
            }
        }

        if (multiXCharEntities.length > 0) {
            for (var e in multiXCharEntities) {
                var entity = multiXCharEntities[e];
                var topicName = "char" + id + "_" + e;

                entity.map = map;
                entity[topicName + "Handler"] = function (newXCharIndex) {
                    var newXChar = this.chars[newXCharIndex];
                    for (var k in this.keys) {
                        this.map[this.keys[k]] = newXChar;
                    }
                };

                Updater.register(topicName, entity);
            }
        }
    },

    enterLayout: function (data) {
        App.Literator.layouts.push(new this.Layout(data.map));
    },

    enterAlphabets: function () {
        for (var i = 0; i < arguments.length; i++) {
            this.enterAlphabet(arguments[i]);
        }
    },

    enterLayouts: function () {
        for (var i = 0; i < arguments.length; i++) {
            this.enterLayout(arguments[i]);
        }
    }

};
