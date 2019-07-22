/* global App */

App.DomMarks = {

    kBoards: [],
    activeKBoard: null,
    kBoardSpace: null,
    editorSpace: null,
    alphSelectLi: null,
    xCharsSelectLi: null,
    layoutSelectLi: null,
    captionsCycleLi: null,
    saveTextButton: null,
    goTopButton: null,

    alphabetHandler: function (alphId) {
        this.activeKBoard = this.kBoards[alphId];
    }

};
