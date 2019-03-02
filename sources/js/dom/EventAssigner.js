
/* global App, Updater, findOne */

App.EventAssigner = {

    initializeWritingOutput: function() {
        var output = App.WritingProcessor.textArea;

        output.addEventListener("keydown", function (event) {
            App.WritingProcessor.catchDown(event);
        });

        output.addEventListener("keyup", function () {
            App.WritingProcessor.dispatch();
        });
    },

    initializeClickControls: function () {
        findOne(".menu").addEventListener("click", function (event) {
            var target = event.target;
            if (target.hasAttribute("data-topic")
                    || (target = target.parentNode).hasAttribute("data-topic")) {
                var topic = target.getAttribute("data-topic");
                Updater.push(
                        topic,
                        target.getAttribute("data-" + topic)
                );
            }
        });

        findOne(".selector-xchars").addEventListener("click", function (event) {
            var target = event.target;
            if (target.hasAttribute("data-d-xchar")) {
                var delta = parseInt(target.getAttribute("data-d-xchar"));
                var li = target.parentNode;
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
            }
        });

        findOne(".switch-subtitles").addEventListener("click", function (event) {
            if (event.target.hasAttribute("data-subtitles")) {
                Updater.push(
                        "subtitles",
                        (event.target.nextElementSibling || event.target.parentNode.firstElementChild)
                                .getAttribute("data-subtitles")
                );
            }
        });
    },

    initializeKBoards: function () {
        App.KBoardProvider.container.addEventListener("click", function (event) {
            if (event.target.hasAttribute("data-xchar")) {
                App.WritingProcessor.write(
                        event.target.getAttribute("data-xchar")
                );
            }
        });
    }

};
