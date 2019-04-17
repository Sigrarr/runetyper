
/* global App, Updater, findOne */

App.EventAssigner = {

    initializeKeyboardEvents: function () {
        var output = App.Writer.textArea;
        output.addEventListener("keydown", App.Writer.catchKeyDown);
        output.addEventListener("keyup", App.Writer.catchKeyUp);

        document.addEventListener("keydown", App.Commands.catchKeyDown);
    },

    initializeControlsClicks: function () {
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

    initializeKBoardsClicks: function () {
        App.KBoardSignaler.container.addEventListener("click", function (event) {
            if (event.target.hasAttribute("data-xchar")) {
                App.Writer.clickWrite(
                        event.target.getAttribute("data-xchar")
                );
            }
        });
    }

};
