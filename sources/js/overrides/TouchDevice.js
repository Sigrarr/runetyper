
/* global App, Updater, findOne, removeNode */

App.overrides.TouchDevice = {

    test: function () {
        return App.touchDev();
    },

    depend: [
        "NoJsSetRangeText"
    ],

    run: function () {
        App.Writer.stdWrite = App.Writer.write;
        App.Writer.write = function (xChar) {
            if (xChar.length > 1 && xChar.charAt(0) === '@') {
                switch (xChar.charAt(1)) {
                    case 's':
                        xChar = ' ';
                        break;
                    case 'n':
                        xChar = "\n";
                        break;
                    case 'b':
                        var wTextArea = this.textArea;
                        var selectionStart = wTextArea.selectionStart;
                        if (selectionStart === wTextArea.selectionEnd && selectionStart > 0) {
                            var value = wTextArea.value;
                            var map = App.DomLandmarks.activeKBoard.backMap;
                            var back = 1;
                            for (var bytes = 1; bytes <= 4 && selectionStart - bytes >= 0; bytes++) {
                                if (value.substring(selectionStart - bytes, selectionStart) in map) {
                                    back = bytes;
                                    break;
                                }
                            }
                            wTextArea.selectionStart -= back;
                        }
                        xChar = '';
                }
            }
            this.stdWrite(xChar);
        };

        if (App.Storage.get("captions") === "keys") {
            Updater.push("captions", "off");
        }
        var captionButtons = App.DomLandmarks.captionsSwitchLi.firstElementChild.children;
        for (var i = 0; i < captionButtons.length; i++) {
            if (captionButtons[i].getAttribute("data-captions") === "keys") {
                removeNode(captionButtons[i]);
                break;
            }
        }

        removeNode(App.DomLandmarks.layoutSelectLi);
        delete App.DomLandmarks.layoutSelectLi;

        var specialInputsprotoboxs = findOne("#touchdev-inputs").children;
        for (var k in App.DomLandmarks.kBoards) {
            var kBoard = App.DomLandmarks.kBoards[k];
            var targetRow = kBoard.lastElementChild.lastElementChild;
            for (var i = 0; i < specialInputsprotoboxs.length; i++) {
                var box = specialInputsprotoboxs[i].cloneNode(true);
                var button = box.firstElementChild;
                targetRow.appendChild(box);
                kBoard.backMap[button.getAttribute("data-xchar")] = button;
            }
        }

        var toolbarLis = findOne("#toolbar").children;
        for (var i in toolbarLis) {
            if (toolbarLis[i].firstElementChild.firstElementChild.getAttribute("data-command") === "eraseSelection") {
                removeNode(toolbarLis[i]);
                break;
            }
        }
    }
};
