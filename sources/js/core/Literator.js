
/* global App */

App.Literator = {

    alphMaps: [],
    layoutMaps: [],
    alphMap: {},
    layoutMap: {},

    tryTrans: function (rawInput) {
        return this.alphMap[
            this.layoutMap.hasOwnProperty(rawInput) ? this.layoutMap[rawInput] : rawInput
        ] || '';
    },

    alphabetHandler: function (newAlphabetId) {
        this.alphMap = this.alphMaps[newAlphabetId];
    },

    layoutHandler: function (newLayoutId) {
        this.layoutMap = this.layoutMaps[newLayoutId];
    }

};
