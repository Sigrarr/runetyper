
/* global App, getByPoint */

App.ClickRepeater = {

    target: null,
    repeating: false,
    tryId: -1,

    init: function () {
        if (App.ClickEvents.move.startsWith("touch")) {
            this.isOut = this.isOutTouch;
        }
        delete this.isOutTouch;
    },

    catchStart: function (event) {
        var repeater = App.ClickRepeater;
        repeater.clear();

        var target = event.target;
        if (target.hasAttribute("data-xchar") || target.classList.contains("repeatable")) {
            repeater.onMove("add");
            repeater.target = target;
            setTimeout(repeater.tryStart, 275, ++repeater.tryId);
        }
    },

    catchMove: function (event) {
        var repeater = App.ClickRepeater;
        if (repeater.target && repeater.isOut(event)) {
            repeater.clear();
        }
    },

    tryStart: function (tryId) {
        var repeater = App.ClickRepeater;
        if (tryId === repeater.tryId && repeater.target && !repeater.repeating) {
            repeater.repeating = setInterval(repeater.repeat, 125);
        }
    },

    repeat: function () {
        var repeater = App.ClickRepeater;
        if (repeater.target) {
            repeater.target[App.ClickEvents.single]();
        } else if (repeater.repeating) {
            clearInterval(repeater.repeating);
            repeater.repeating = false;
        }
    },

    clear: function () {
        var repeater = App.ClickRepeater;
        if (repeater.target) {
            repeater.onMove("remove");
            repeater.target = null;
        }
    },

    onMove: function (whatToDoWithEventListener) {
        App.DomMarks.workspace[whatToDoWithEventListener + "EventListener"](
                App.ClickEvents.move, App.ClickRepeater.catchMove
        );
    },

    isOut: function (moveEvent) {
        return getByPoint(moveEvent) !== this.target;
    },

    isOutTouch: function (moveEvent) {
        var touches = moveEvent.targetTouches;
        return touches.length !== 1 || getByPoint(touches[0]) !== this.target;
    }

};
