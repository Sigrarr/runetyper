
/* global App */

App.ClickEvents = {

    start: "",
    end: "",
    single: "",
    move: "",

    init: function () {
        var clickEventsToCheck = {
            start: ["touchstart", "mousedown"],
            end: ["touchend", "mouseup"],
            single: ["touch", "tap", "click", "touchend", "mouseup"],
            move: ["touchmove", "mousemove"]
        };

        for (var key in clickEventsToCheck) {
            for (var i in clickEventsToCheck[key]) {
                if (("on" + clickEventsToCheck[key][i]) in document.body) {
                    this[key] = clickEventsToCheck[key][i];
                    break;
                }
            }
        }
    }

};
