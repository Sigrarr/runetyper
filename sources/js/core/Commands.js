
/* global App, Updater, findActiveChild */

App.Commands = {

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
