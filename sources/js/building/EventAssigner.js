
/* global App, Updater, getById */

App.EventAssigner = {

    run: function () {
        var assignments = this.assignments;
        for (var i in assignments) {
            if (assignments[i]) {
                assignments[i]();
            }
        }
    },

    assignments: {

        keyboardWriting: App.Dev.std && function () {
            var textArea = App.Writer.textArea;
            textArea.addEventListener("keydown", App.Writer.catchKeyDown);
            textArea.addEventListener("keyup", App.Writer.catchKeyUp);
        },

        commandKeys: App.Dev.std && function () {
            document.addEventListener("keydown", App.Commands.catchKeyDown);
        },

        touchSelection: App.Dev.touch && function () {
            App.Selection.eElement.addEventListener(App.Selection.eName, App.Writer.textArea.catchSelection);
        },

        clickWriting: function () {
            App.DomMarks.kBoardSpace.addEventListener(App.ClickEvents.single, function (event) {
                if (event.target.hasAttribute("data-xchar")) {
                    App.Writer.clickWrite(
                            event.target.getAttribute("data-xchar")
                    );
                }
            });
        },

        menuClicks: function () {
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
            var menus = getByClass("menu");
            for (var i = menus.length - 1; i >= 0; i--) {
                menus[i].addEventListener(App.ClickEvents.single, menuClickHandler);
            }

            var selectSwitchingHandler = function (event) {
                var select = App.SelectsController.findContainingSelect(event.target, true);
                if (select) {
                    event.stopPropagation();
                    App.SelectsController.handle(select);
                }
            };
            getById("main-menu").addEventListener(App.ClickEvents.single, selectSwitchingHandler);

            var selectClearingHandler = function (event) {
                if (!App.SelectsController.findContainingSelect(event.target, false)) {
                    App.SelectsController.clear();
                }
            };
            App.DomMarks.workspace.addEventListener(App.ClickEvents.single, selectClearingHandler);
        },

        clickRepeats: function () {
            var repeater = App.ClickRepeater;
            var targetContainers = [App.DomMarks.kBoardSpace, getById("toolbar")];

            for (var i = targetContainers.length - 1; i >= 0; i--) {
                targetContainers[i].addEventListener(App.ClickEvents.start, repeater.catchStart);
                targetContainers[i].addEventListener(App.ClickEvents.end, repeater.clear);
            }
        },

        resizeHandling: function () {
            window.addEventListener("resize", App.Fitter.fit);
        },

        contextMenuBlocking: App.Dev.touch && function () {
            App.DomMarks.workspace.addEventListener("contextmenu", function (event) {
                for (var target = event.target, i = 0; i < 2 && target; i++, target = target.parentNode) {
                    if (target === App.Writer.textArea.div) {
                        return;
                    }
                }
                event.stopPropagation();
                event.preventDefault();
            });
        }

    }

};
