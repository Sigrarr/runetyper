
/* global App, Updater, findActiveChild */

App.Commands = {

    shiftXChars: function (delta) {
        var activeUl = findActiveChild(App.DomMarks.xCharsSelectLi);
        if (!activeUl) {
            return;
        }

        var li = activeUl.firstElementChild;
        while ((li = li.nextElementSibling)) {
            var buttons = li.children;
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].classList.contains("active")) {
                    var newActiveIndex = i + parseInt(delta);
                    if (newActiveIndex >= 0 && newActiveIndex < buttons.length) {
                        Updater.push(
                                buttons[i].getAttribute("data-topic"),
                                newActiveIndex
                        );
                    }
                    break;
                }
            }
        }
    },

    cycleCaptions: function (deltaSgn) {
        var active = findActiveChild(App.DomMarks.captionsCycleLi.firstElementChild);
        var target = deltaSgn < 0 ? (active.previousElementSibling || active.parentNode.lastElementChild)
            : (active.nextElementSibling || active.parentNode.firstElementChild);

        Updater.push("captions", target.getAttribute("data-captions"));
    },

    changeFontSize: function (deltaSgn) {
        var resizer = App.OutFontResizer;
        deltaSgn ? resizer.tryChange(+deltaSgn) : resizer.set(resizer.styleDefault);
    },

    saveText: function () {
        App.Storage.set("_text", App.Writer.textArea.value);
        Updater.push("loadable_text", +(App.Writer.textArea.value.length > 0));
        App.DomSignaler.signalButton(App.DomMarks.saveTextButton);
    },

    pasteText: function () {
        var text = App.Storage.get("_text");
        if (text) {
            App.Writer.write(text);
            App.Writer.textArea.focus();
        }
    },

    selectAll: function () {
        App.Writer.textArea.focus();
        App.Writer.textArea.select();
    },

    eraseSelection: function () {
        App.Writer.write('');
        App.Writer.textArea.focus();
    },

    commandHandler: function (message) {
        var messageParts = message.split(':');
        var functionName = messageParts[0];
        if (typeof this[functionName] === "function") {
            this[functionName](messageParts[1]);
        } else {
            console.warn("@command", message, '?');
        }
    }

};

if (App.Dev.std) {

    App.Commands.catchKeyDown = function (event) {
        if (App.Commands.runMatch(event) !== false) {
            event.stopPropagation();
            event.preventDefault();
        }
    };

    App.Commands.runMatch = function (event) {
        var commands = this;
        switch (event.key) {
            case "Help":
                App.SelectsController.clear();
                Updater.push("view", "info");
                return true;
            case "Escape":
                App.SelectsController.clear();
                Updater.push("view", "workspace");
                return true;
            case "ArrowLeft":
                return event.ctrlKey
                        && commands.shiftXChars(-1);
            case "ArrowRight":
                return event.ctrlKey
                        && commands.shiftXChars(1);
            case "PageUp":
                return App.ViewController.current === "workspace"
                        && commands.cycleCaptions(-1);
            case "PageDown":
                return App.ViewController.current === "workspace"
                        && commands.cycleCaptions(1);
            case 's':
                return event.ctrlKey
                        && commands.saveText();
            case '-':
            case '_':
                return event.ctrlKey && event.shiftKey
                        && commands.changeFontSize(-1);
            case '+':
            case '=':
                return event.ctrlKey && event.shiftKey
                        && commands.changeFontSize(1);
            case '0':
            case ')':
                return event.ctrlKey && event.shiftKey
                        && commands.changeFontSize(0);
        }
        return false;
    };

}
