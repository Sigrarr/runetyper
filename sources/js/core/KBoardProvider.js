
/* global App */

App.KBoardProvider = {

    container: null,
    kBoards: [],
    currentKBoard: null,

    getButton: function (xChar) {
        return this.currentKBoard.backMap[xChar];
    },

    alphabetHandler: function (alphId) {
        this.currentKBoard = this.kBoards[alphId];
    }

};
