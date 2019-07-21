
/* global App, Updater, findActiveChild */

App.Commands = {

    catchKeyDown: function (event) {
        var commands = App.Commands;
        var commandMatch = false;

        switch (event.key) {
            case "Escape":
                App.MenuSelectController.clear();
                Updater.push("view", "workspace");
                commandMatch = true;
                break;
            case "ArrowLeft":
                if (event.ctrlKey) {
                    commands.shiftXChars(-1);
                    commandMatch = true;
                }
                break;
            case "ArrowRight":
                if (event.ctrlKey) {
                    commands.shiftXChars(1);
                    commandMatch = true;
                }
                break;
            case "Insert":
                commands.switchCaptions();
                commandMatch = true;
                break;
            case 's':
                if (event.ctrlKey) {
                    commands.saveText();
                    commandMatch = true;
                }
            case '-':
            case '_':
                if (event.ctrlKey && event.shiftKey) {
                    commands.changeFontSize(-1);
                    commandMatch = true;
                }
                break;
            case '+':
            case '=':
                if (event.ctrlKey && event.shiftKey) {
                    commands.changeFontSize(1);
                    commandMatch = true;
                }
                break;
            case '0':
            case ')':
                if (event.ctrlKey && event.shiftKey) {
                    var controller = App.OutFontSizeController;
                    controller.set(controller.styleDefault);
                    commandMatch = true;
                }
                break;
        }

        if (commandMatch) {
            event.preventDefault();
            event.stopPropagation();
        }
    },

    shiftXChars: function (delta) {
        var li = findActiveChild(App.DomLandmarks.xCharsSelectLi).firstElementChild;
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

    changeFontSize: function(deltaSgn) {
        App.OutFontSizeController.tryChange(+deltaSgn);
    },

    saveText: function () {
        App.Storage.set("_text", App.Writer.textArea.value);
        Updater.push("loadable_text", +(App.Writer.textArea.value.length > 0));
        App.DomSignaler.signalButton(App.DomLandmarks.saveTextButton);
    },

    pasteText: function () {
        var text = App.Storage.get("_text");
        if (text) {
            App.Writer.write(text);
            App.Writer.textArea.focus();
        }
    },

    selectAll: function () {
        var textArea = App.Writer.textArea;
        textArea.selectionEnd = textArea.value.length;
        textArea.selectionStart = 0;
        textArea.focus();
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
