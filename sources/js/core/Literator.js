
/* global App */

App.Literator = {

    alphMaps: [],
    layoutMaps: [],
    keyHeadSets: [],
    alphId: -1,
    layoutId: -1,
    alphMap: {},
    layoutMap: {},
    keyHeadSet: {},

    tryTrans: function (rawInput) {
        return this.alphMap[
                rawInput in this.layoutMap ? this.layoutMap[rawInput] : rawInput
        ] || '';
    },

    alphabetHandler: function (newAlphabetId) {
        this.alphId = newAlphabetId;
        this.alphMap = this.alphMaps[newAlphabetId];
        this.setKeyHeadSet();
    },

    layoutHandler: function (newLayoutId) {
        this.layoutId = newLayoutId;
        this.layoutMap = this.layoutMaps[newLayoutId];
        this.setKeyHeadSet();
    },

    setKeyHeadSet: function () {
        this.keyHeadSet = this.keyHeadSets[this.alphId][this.layoutId];
    }

};
