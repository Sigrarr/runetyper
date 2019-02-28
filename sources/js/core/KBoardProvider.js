
/* global App */

App.KBoardProvider = {

    container: null,
    kBoards: [],
    currentKBoard: null,

    addKBoard: function (kBoard) {
        this.kBoards.push(kBoard);
        this.container.appendChild(kBoard);
    },

    getButton: function (xChar) {
        return this.currentKBoard.backMap[xChar];
    },

    alphabetHandler: function (alphId) {
        this.currentKBoard = this.kBoards[alphId];
    }

};
