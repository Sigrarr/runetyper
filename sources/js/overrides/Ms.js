
/* global App */

App.Ms = {

    map: {
        "Spacebar": ' ',
        "Esc": "Escape",
        "Left": "ArrowLeft",
        "Right": "ArrowRight"
    },

    runOverride: function () {
        App.Writer.textArea.removeEventListener("keydown", App.Writer.catchKeyDown);
        App.Writer.textArea.addEventListener("keydown", function (event) {
            App.Writer.catchKeyDown(App.Ms.filter(event));
        });

        document.removeEventListener("keydown", App.Commands.catchKeyDown);
        document.addEventListener("keydown", function (event) {
            App.Commands.catchKeyDown(App.Ms.filter(event));
        });
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
