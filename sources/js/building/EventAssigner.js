
/* global App, Updater, getById */

App.EventAssigner = {

    run: function () {
        if (App.Dev.std) {
            this.assingKeyboardWriting();
            this.assignCommandKeys();
        } else {
            this.assignTouchSelection();
        }

        this.assignClickWriting();
        this.assignMenuClicks();
        this.assignClickRepeats();
        this.assignResizeHandling();
    },

    assingKeyboardWriting: function () {
        var textArea = App.Writer.textArea;
        textArea.addEventListener("keydown", App.Writer.catchKeyDown);
        textArea.addEventListener("keyup", App.Writer.catchKeyUp);
    },

    assignCommandKeys: function () {
        document.addEventListener("keydown", App.Commands.catchKeyDown);
    },

    assignTouchSelection: function () {
        var element = App.Writer.textArea.div;
        element.addEventListener(App.EventMarks.click.end, function () {
            setTimeout(App.Writer.textArea.catchTouch, 0);
        });
    },

    assignClickWriting: function () {
        App.DomMarks.kBoardSpace.addEventListener(App.EventMarks.click.single, function (event) {
            if (event.target.hasAttribute("data-xchar")) {
                App.Writer.clickWrite(
                        event.target.getAttribute("data-xchar")
                );
            }
        });
    },

    assignMenuClicks: function () {
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
            menus[i].addEventListener(App.EventMarks.click.single, menuClickHandler);
        }

        var selectSwitchHandler = function (event) {
            var select = App.SelectsController.findContainingSelect(event.target, true);
            if (select) {
                event.stopPropagation();
                App.SelectsController.handle(select);
            }
        };
        getById("main-menu").addEventListener(App.EventMarks.click.single, selectSwitchHandler);

        var selectClearingHandler = function (event) {
            if (!App.SelectsController.findContainingSelect(event.target, false)) {
                App.SelectsController.clear();
            }
        };
        App.DomMarks.workspace.addEventListener(App.EventMarks.click.single, selectClearingHandler);
    },

    assignClickRepeats: function () {
        var repeater = App.ClickRepeater;
        var targetContainers = [App.DomMarks.kBoardSpace, getById("toolbar")];

        for (var i = targetContainers.length - 1; i >= 0; i--) {
            targetContainers[i].addEventListener(App.EventMarks.click.start, repeater.catchDown);
            targetContainers[i].addEventListener(App.EventMarks.click.end, repeater.clear);
        }
    },

    assignResizeHandling: function () {
        window.addEventListener("resize", App.FitController.fit);
    }

};
