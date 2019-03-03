
/* global App, Updater, findOne */

App.EventAssigner = {

    initializeWritingOutput: function () {
        var output = App.WritingProcessor.textArea;

        output.addEventListener("keydown", function (event) {
            App.WritingProcessor.catchKeyDown(event);
        });

        output.addEventListener("keyup", function () {
            App.WritingProcessor.dispatch();
        });
    },

    initializeKeyCommands: function () {
        document.addEventListener("keydown", function (event) {
            App.Commands.catchKeyDown(event);
        });
    },

    initializeClickControls: function () {
        var menus = findMany(".menu");
        for (var i = 0; i < menus.length; i++) {
            menus[i].addEventListener("click", function (event) {
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
        }

        App.MenuProvider.xCharsSelectLi.addEventListener("click", function (event) {
            var target = event.target;
            if (target.hasAttribute("data-d-xchar")) {
                App.Commands.shiftXChars(
                        parseInt(target.getAttribute("data-d-xchar")),
                        target.parentNode
                );
            }
        });

        App.MenuProvider.subtitlesSwitchLi.addEventListener("click", function (event) {
            var target = event.target;
            if (target.hasAttribute("data-subtitles")
                    || (target = target.parentNode).hasAttribute("data-subtitles")) {
                App.Commands.shiftSubtitles(target);
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
