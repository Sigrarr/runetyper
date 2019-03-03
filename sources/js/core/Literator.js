
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
        this.currentAlphMap = this.alphMaps[newAlphabetId];
    },

    layoutHandler: function (newLayoutId) {
        this.currentLayout = this.layouts[newLayoutId];
    }

};
