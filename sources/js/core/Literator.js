
/* global App */

App.Literator = {

    alphMaps: [],
    layoutMaps: [],
    halfKeySets: [],
    alphId: -1,
    layoutId: -1,
    alphMap: {},
    layoutMap: {},
    halfKeySet: {},

    tryTrans: function (rawInput) {
        return this.alphMap[
                this.layoutMap.hasOwnProperty(rawInput) ? this.layoutMap[rawInput] : rawInput
        ] || '';
    },

    isHalfKey: function (keyChar) {
        return this.halfKeySet[keyChar];
    },

    alphabetHandler: function (newAlphabetId) {
        this.alphId = newAlphabetId;
        this.alphMap = this.alphMaps[newAlphabetId];
        this.setHalfKeySet();
    },

    layoutHandler: function (newLayoutId) {
        this.layoutId = newLayoutId;
        this.layoutMap = this.layoutMaps[newLayoutId];
        this.setHalfKeySet();
    },

    setHalfKeySet: function () {
        this.halfKeySet = this.halfKeySets[this.alphId][this.layoutId];
    }

};
