
/* global App, Updater, findActiveChild */

App.Commands = {

    catchKeyDown: function (event) {
        var commandMatch = false;
        switch (event.key) {
            case "Escape":
                App.Commands.closeInformationView();
                commandMatch = true;
                break;
            case "ArrowLeft":
                if (event.ctrlKey) {
                    App.Commands.shiftXChars(-1);
                    commandMatch = true;
                }
                break;
            case "ArrowRight":
                if (event.ctrlKey) {
                    App.Commands.shiftXChars(1);
                    commandMatch = true;
                }
                break;
            case "Insert":
                App.Commands.shiftSubtitles();
                commandMatch = true;
                break;
            case 's':
                if (event.ctrlKey) {
                    App.Commands.saveText();
                    commandMatch = true;
                }
        }

        if (commandMatch) {
            event.preventDefault();
            event.stopPropagation();
        }
    },

    closeInformationView: function () {
        Updater.push("view", "workspace");
    },

    shiftXChars: function (delta, controlLi) {
        var li = controlLi || findActiveChild(App.MenuProvider.xCharsSelectLi).firstElementChild;
        while (li = li.nextElementSibling) {
            var buttons = li.children;
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].classList.contains("active")) {
                    var newActiveIndex = i + delta;
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

    shiftSubtitles: function (activeButton) {
        var target = activeButton || findActiveChild(App.MenuProvider.subtitlesSwitchLi.firstElementChild);
        Updater.push(
                "subtitles",
                (target.nextElementSibling || target.parentNode.firstElementChild)
                    .getAttribute("data-subtitles")
        );
    },

    saveText: function () {
        App.Storage.set("_text", App.WritingProcessor.textArea.value);
    },

    loadText: function () {
        var text = App.Storage.get("_text");
        if (text) {
            App.WritingProcessor.textArea.value = '';
            App.WritingProcessor.write(text);
        }
    }

};
