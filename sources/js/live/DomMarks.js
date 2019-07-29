/* global App */

App.DomMarks = {

    kBoards: [],

    get activeKBoard() {
        return this.kBoards[App.Storage.get("alphabet")];
    },

    get textArea() {
        return App.Writer.textArea.div || App.Writer.textArea;
    },

    kBoardSpace: null,
    editorSpace: null,
    xCharsSelectLi: null,
    captionsCycleLi: null,
    saveTextButton: null,
    goTopButton: null

};
