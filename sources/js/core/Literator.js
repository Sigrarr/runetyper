
/* global App */

App.Literator = {

    alphMaps: [],
    layouts: [],
    currentAlphMap: {},
    currentLayout: {},

    tryTransliterate: function (rawInput) {
        var normalInput = this.currentLayout.normalize(rawInput);

        return this.currentAlphMap.hasOwnProperty(normalInput) ?
                this.currentAlphMap[normalInput] : '';
    },

    alphabetHandler: function (newAlphabetId) {
        if (typeof this.alphMaps[newAlphabetId] === "undefined") {
            console.warn("Wrong alphabet: " + newAlphabetId);
        } else {
            this.currentAlphMap = this.alphMaps[newAlphabetId];
        }
    },

    layoutHandler: function (newLayoutId) {
        if (typeof this.layouts[newLayoutId] === "undefined") {
            console.warn("Wrong layout: " + newLayoutId);
        } else {
            this.currentLayout = this.layouts[newLayoutId];
        }
    }
};
