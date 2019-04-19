
/* global App, Updater, findOne */

App.EventAssigner = {

    initializeKeyboardEvents: function () {
        var output = App.Writer.textArea;
        output.addEventListener("keydown", App.Writer.catchKeyDown);
        output.addEventListener("keyup", App.Writer.catchKeyUp);

        document.addEventListener("keydown", App.Commands.catchKeyDown);
    },

    initializeMenuClicks: function () {
        var menuClickHandler = function (event) {
            var target = event.target;
            for (var i = 0; i < 3 && target && !target.hasAttribute("data-topic"); i++) {
                target = target.parentNode;
            }
            if (target && target.hasAttribute("data-topic")) {
                var topic = target.getAttribute("data-topic");
                Updater.push(
                        topic,
                        target.getAttribute("data-" + topic)
                );
            }
        };
        var menus = findMany(".menu");
        for (var i = 0; i < menus.length; i++) {
            menus[i].addEventListener("click", menuClickHandler);
        }
    },

    initializeXCharButtonClicks: function () {
        App.DomLandmarks.kBoardContainer.addEventListener("click", function (event) {
            if (event.target.hasAttribute("data-xchar")) {
                App.Writer.clickWrite(
                        event.target.getAttribute("data-xchar")
                );
            }
        });
    }

};
