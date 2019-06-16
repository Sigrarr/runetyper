
/* global App */

App.KBoardFitController = {

    kBoard: null,
    box: null,
    rId: -1,

    resizeHandler: function () {
        var controller = App.KBoardFitController;
        var resizeId = ++controller.rId;
        var container = App.DomLandmarks.kBoardContainer;

        container.classList.add("resizing");
        container.classList.remove("fit-max");

        var mode = Math.abs(window.innerWidth - container.offsetWidth) < 100 ?
                controller.modes.narrow : controller.modes.wide;

        container.classList.remove(mode.fitClassR);
        container.classList.add(mode.fitClass);

        var activeKBoard = App.DomLandmarks.activeKBoard;
        var previousMKBoard = controller.kBoard;

        if (activeKBoard.classList.contains(mode.mClass)) {
            controller.kBoard = mode.mKBoard = activeKBoard;
        } else {
            activeKBoard.style.display = "none";
            controller.kBoard = mode.mKBoard;
            controller.kBoard.style.removeProperty("display");
        }

        if (previousMKBoard !== controller.kBoard && previousMKBoard) {
            previousMKBoard.style.display = "none";
        }

        controller.box = controller.kBoard
                .firstElementChild
                .firstElementChild
                .firstElementChild;

        setTimeout(mode.handle, 0, resizeId);
    },

    modes: {
        wide: {
            mKBoard: null,
            mClass: "wide",
            fitClass: "fit-h",
            fitClassR: "fit-w",
            handle: function (resizeId) {
                var controller = App.KBoardFitController;
                if (resizeId !== controller.rId) {
                    return;
                }

                var container = App.DomLandmarks.kBoardContainer;
                var boxSize = controller.box.offsetWidth;

                var fit = true;
                for (var sections = controller.kBoard.children, i = 0; fit && i < sections.length; i++) {
                    for (var rows = sections[i].children, j = 0; fit && j < rows.length; j++) {
                        var row = rows[j];
                        if (row.offsetHeight >= 2 * boxSize || row.offsetWidth >= container.offsetWidth) {
                            container.classList.remove("fit-h");
                            container.classList.add("fit-w");
                            fit = false;
                        }
                    }
                }

                setTimeout(controller.finalize, 0, resizeId);
            }
        },
        narrow: {
            mKBoard: null,
            mClass: "tall",
            fitClass: "fit-w",
            fitClassR: "fit-h",
            handle: function (resizeId) {
                var controller = App.KBoardFitController;
                if (resizeId !== controller.rId) {
                    return;
                }

                var container = App.DomLandmarks.kBoardContainer;
                if (controller.kBoard.offsetHeight >= container.offsetHeight) {
                    container.classList.remove("fit-w");
                    container.classList.add("fit-h");
                }

                setTimeout(controller.finalize, 0, resizeId);
            }
        }
    },

    finalize: function (resizeId) {
        var controller = App.KBoardFitController;
        if (resizeId !== controller.rId) {
            return;
        }

        var landmarks = App.DomLandmarks;
        var container = landmarks.kBoardContainer;

        if (1 >= Math.abs(controller.box.offsetWidth
                - parseInt(getComputedStyle(controller.box).getPropertyValue("max-width")))) {
            container.classList.remove(controller.modes.wide.fitClass);
            container.classList.remove(controller.modes.narrow.fitClass);
            container.classList.add("fit-max");
        }

        if (controller.kBoard !== landmarks.activeKBoard) {
            controller.kBoard.style.display = "none";
            landmarks.activeKBoard.style.removeProperty("display");
        }

        container.classList.remove("resizing");
    },

    viewHandler: function (view) {
        if (view === "workspace") {
            this.resizeHandler();
        }
    }

};
