
/* global App, Env */

App.overrides.push({

    message: "MS browser - keyboard events may have non-standard 'key' field",

    test: function () {
        return Env.browser === "ms";
    },

    run: function () {
        App.MsKeys = this.MsKeys;

        App.Writer.textArea.removeEventListener("keydown", App.Writer.catchKeyDown);
        App.Writer.textArea.addEventListener("keydown", function (event) {
            App.Writer.catchKeyDown(App.MsKeys.filter(event));
        });

        document.removeEventListener("keydown", App.Commands.catchKeyDown);
        document.addEventListener("keydown", function (event) {
            App.Commands.catchKeyDown(App.MsKeys.filter(event));
        });
    },

    MsKeys: {
        map: {
            "Spacebar": ' ',
            "Esc": "Escape",
            "Left": "ArrowLeft",
            "Right": "ArrowRight"
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
    }
});