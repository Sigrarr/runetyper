/* global App */

App.DomMarks = {

    kBoards: [],
    get activeKBoard() {
        return this.kBoards[App.Storage.get("alphabet")];
    },

    kBoardSpace: null,
    editorSpace: null,
    alphSelectLi: null,
    xCharsSelectLi: null,
    layoutSelectLi: null,
    captionsCycleLi: null,
    saveTextButton: null,
    goTopButton: null

};
