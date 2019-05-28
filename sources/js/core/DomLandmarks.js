/* global App */

App.DomLandmarks = {

    kBoards: [],
    activeKBoard: null,
    alphSelectLi: null,
    xCharsSelectLi: null,
    layoutSelectLi: null,
    captionsSwitchLi: null,
    viewSwitchLi: null,
    kBoardContainer: null,
    saveTextButton: null,
    goTopButton: null,

    alphabetHandler: function (alphId) {
        this.activeKBoard = this.kBoards[alphId];
    }

};
