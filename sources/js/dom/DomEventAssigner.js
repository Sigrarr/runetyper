
/* global App, Updater, findElement */

App.DomEventAssigner = {

    initializeWritingOutput: function() {
        var output = App.WritingProcessor.textArea;

        output.addEventListener("keydown", function (event) {
            App.WritingProcessor.catchDown(event);
        });

        output.addEventListener("keyup", function () {
            App.WritingProcessor.dispatch();
        });
    },

    initializeMenuSelects: function () {
        App.MenuBuilder.alphSelectUl.addEventListener("click", function (event) {
            if (event.target.hasAttribute("data-alphabet")) {
                Updater.push("alphabet", event.target.getAttribute("data-alphabet"));
            } else if (event.target.parentNode.hasAttribute("data-alphabet")) {
                Updater.push("alphabet", event.target.parentNode.getAttribute("data-alphabet"));
            }
        });

        App.MenuBuilder.xCharSelectLi.addEventListener("click", function (event) {
            var target = event.target;
            if (target.hasAttribute("data-topic") && target.hasAttribute("data-xchar")) {
                Updater.push(
                        target.getAttribute("data-topic"),
                        target.getAttribute("data-xchar")
                );
            }
        });

        App.MenuBuilder.layoutSelectUl.addEventListener("click", function (event) {
            if (event.target.hasAttribute("data-layout")) {
                Updater.push("layout", event.target.getAttribute("data-layout"));
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
