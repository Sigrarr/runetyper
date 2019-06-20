
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
            var topic = null;
            for (var i = 0, target = event.target; i < 3 && target && !topic; i++) {
                (topic = target.getAttribute("data-topic")) || (target = target.parentNode);
            }
            if (topic) {
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

        var workspace = findOne("#workspace");

        var selectSwitchHandler = function (event) {
            var select = App.MenuSelectController.findContainingSelect(event.target, true);
            if (select) {
                event.stopPropagation();
                App.MenuSelectController.handle(select);
            }
        };
        workspace.firstElementChild.children[1].addEventListener("click", selectSwitchHandler);

        var selectClearingHandler = function (event) {
            if (!App.MenuSelectController.findContainingSelect(event.target, false)) {
                App.MenuSelectController.clear();
            }
        };
        workspace.addEventListener("click", selectClearingHandler);
    },

    initializeXCharButtonClicks: function () {
        App.DomLandmarks.kBoardContainer.addEventListener("click", function (event) {
            if (event.target.hasAttribute("data-xchar")) {
                App.Writer.clickWrite(
                        event.target.getAttribute("data-xchar")
                );
            }
        });
    },

    initializeResizeHandling: function () {
        window.addEventListener("resize", App.FitController.fit);
    }

};
