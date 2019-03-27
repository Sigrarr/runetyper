
/* global App */

App.KBoardSignaler = {

    container: null,
    kBoards: [],
    currentMap: null,

    signalByXString: function (xString) {
        var multibyteXCharCandidate = "";
        var button = null;
        for (var i = 0; i < xString.length; i++) {
            multibyteXCharCandidate += xString.charAt(i);
            if (button = this.currentMap[multibyteXCharCandidate]) {
                this.signalButton(button);
                multibyteXCharCandidate = "";
            }
        }
    },

    signalButton: function (button) {
        button.classList.add("signal");
        setTimeout(function () {
            button.classList.remove("signal");
        }, 250);
    },

    alphabetHandler: function (alphId) {
        this.currentMap = this.kBoards[alphId].backMap;
    }

};
