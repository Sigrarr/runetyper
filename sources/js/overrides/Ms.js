
/* global App */

App.Ms = {

    map: {
        "Spacebar": ' ',
        "Esc": "Escape",
        "Left": "ArrowLeft",
        "Right": "ArrowRight"
    },

    runOverride: function () {
        App.WritingProcessor.baseCatchKeyDown = App.WritingProcessor.catchKeyDown;
        App.WritingProcessor.catchKeyDown = function (event) {
            this.baseCatchKeyDown(App.Ms.filter(event));
        };

        App.Commands.baseCatchKeyDown = App.Commands.catchKeyDown;
        App.Commands.catchKeyDown = function (event) {
            this.baseCatchKeyDown(App.Ms.filter(event));
        };
    },

    filter: function (event) {
        if (event.key.length > 1) {
            var properKey = this.map[event.key];
            if (properKey) {
                return {
                    key: properKey,
                    ctrlKey: event.ctrlKey,
                    preventDefault: event.preventDefault,
                    stopPropagation: event.stopPropagation
                };
            }
        }

        return event;
    }

};
