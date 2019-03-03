
/* global App, Updater, findOne */

App.EventAssigner = {

    initializeWritingOutput: function () {
        var output = App.WritingProcessor.textArea;

        output.addEventListener("keydown", function (event) {
            App.WritingProcessor.catchDown(event);
        });

        output.addEventListener("keyup", function () {
            App.WritingProcessor.dispatch();
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
    },

    initializeKeyCommands: function () {
        document.addEventListener("keydown", function (event) {
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
        });
    }

};
