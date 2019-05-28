
/* global App */

App.DomSignaler = {

    initialize: function () {
        this.signalByXString = function (xString) {
            var map = App.DomLandmarks.activeKBoard.backMap;
            var multibyteXCharCandidate = "";
            var button = null;
            for (var i = 0; i < xString.length; i++) {
                multibyteXCharCandidate += xString.charAt(i);
                if (button = map[multibyteXCharCandidate]) {
                    App.DomSignaler.signalButton(button);
                    multibyteXCharCandidate = "";
                }
            }
        };
        delete App.DomSignaler.initialize;
    },

    signalByXString: function () {},

    signalButton: function (button) {
        button.classList.add("signal");
        setTimeout(function () {
            button.classList.remove("signal");
        }, 250);
    }

};
