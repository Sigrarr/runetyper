
/* global App */

App.EventMarks = {

    click: {
        start: "",
        end: "",
        single: ""
    },

    initialize: function () {
        var clickEventsToCheck = {
            start: ["touchstart", "mousedown"],
            end: ["touchend", "mouseup"],
            single: ["touch", "tap", "click", "touchend", "mouseup"]
        };

        for (var key in clickEventsToCheck) {
            for (var i in clickEventsToCheck[key]) {
                if (("on" + clickEventsToCheck[key][i]) in document.body) {
                    this.click[key] = clickEventsToCheck[key][i];
                    break;
                }
            }
        }
    }

};
