
/* global App, Updater, findActiveChild */

App.Commands = {

    shiftXChars: function (delta) {
        var li = findActiveChild(App.DomMarks.xCharsSelectLi).firstElementChild;
        while (li = li.nextElementSibling) {
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

    cycleCaptions: function () {
        var target = findActiveChild(App.DomMarks.captionsCycleLi.firstElementChild);
        Updater.push(
                "captions",
                (target.nextElementSibling || target.parentNode.firstElementChild)
                    .getAttribute("data-captions")
        );
    },

    changeFontSize: function(deltaSgn) {
        App.OutFontSizeController.tryChange(+deltaSgn);
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
        var commands = App.Commands;
        var match = false;

        switch (event.key) {
            case "Escape":
                App.SelectsController.clear();
                Updater.push("view", "workspace");
                match = true;
                break;
            case "ArrowLeft":
                if (event.ctrlKey) {
                    commands.shiftXChars(-1);
                    match = true;
                }
                break;
            case "ArrowRight":
                if (event.ctrlKey) {
                    commands.shiftXChars(1);
                    match = true;
                }
                break;
            case "Insert":
                commands.cycleCaptions();
                match = true;
                break;
            case 's':
                if (event.ctrlKey) {
                    commands.saveText();
                    match = true;
                }
            case '-':
            case '_':
                if (event.ctrlKey && event.shiftKey) {
                    commands.changeFontSize(-1);
                    match = true;
                }
                break;
            case '+':
            case '=':
                if (event.ctrlKey && event.shiftKey) {
                    commands.changeFontSize(1);
                    match = true;
                }
                break;
            case '0':
            case ')':
                if (event.ctrlKey && event.shiftKey) {
                    var controller = App.OutFontSizeController;
                    controller.set(controller.styleDefault);
                    match = true;
                }
                break;
        }

        if (match) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

}
