
/* global App, Env */

App.overrides.after.MsKeyboardEvents = {

    test: function () {
        return App.Dev.std && Env.browser === "ms";
    },

    run: function () {
        App.MsKAdapter = this.MsKAdapter;

        App.Writer.textArea.removeEventListener("keydown", App.Writer.catchKeyDown);
        App.Writer.textArea.addEventListener("keypress", function (e) {
            App.Writer.catchKeyDown(App.MsKAdapter.normalize(e));
        });

        document.removeEventListener("keydown", App.Commands.catchKeyDown);
        window.addEventListener("keydown", function (e) {
            App.Commands.catchKeyDown(App.MsKAdapter.normalize(e));
        });
    },

    MsKAdapter: {
        map: {
            "Spacebar": ' ',
            "Esc": "Escape",
            "Left": "ArrowLeft",
            "Right": "ArrowRight",
            get Unidentified() {
                switch (event.keyCode) {
                    case 187:
                        return '=';
                    case 189:
                        return '-';
                    default:
                        return String.fromCharCode(event.keyCode);
                }
            }
        },

        normalize: function (e) {
            return {
                key: this.map[e.key] || e.key,
                ctrlKey: e.ctrlKey && !e.altKey,
                shiftKey: e.shiftKey,
                preventDefault: this.preventDefault,
                stopPropagation: this.stopPropagation
            };
        },

        preventDefault: function () {
            event.preventDefault();
        },

        stopPropagation: function () {
            event.stopPropagation();
        }
    }

};
