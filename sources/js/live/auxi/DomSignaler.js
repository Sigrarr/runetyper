
/* global App */

App.DomSignaler = {

    init: function () {
        this.signalByXString = function (xString) {
            var map = App.DomMarks.activeKBoard.backMap;
            var multibyteXCharCandidate = "";
            var button = null;
            for (var i = xString.length - 1; i >= 0; i--) {
                multibyteXCharCandidate = xString.charAt(i) + multibyteXCharCandidate;
                if ((button = map[multibyteXCharCandidate])) {
                    App.DomSignaler.signalButton(button, i * 20);
                    multibyteXCharCandidate = "";
                }
            }
        };
    },

    signalByXString: function () {},

    signalButton: function (button, optDelay) {
        var delay = optDelay || 0;

        setTimeout(function () {
            button.classList.add("signal");
        }, delay);

        setTimeout(function () {
            button.classList.remove("signal");
        }, 250 + delay);
    }

};
