
/* global App */

App.Literator = {

    alphMaps: [],
    layouts: [],
    currentAlphMap: {},
    currentLayout: {},

    tryTrans: function (rawInput) {
        return this.currentAlphMap[this.currentLayout.normalize(rawInput)] || '';
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
