
/* global App */

App.KBoardFitController = {

    longRowKBoard: null,
    rId: 0,

    resizeHandler: function () {
        var controller = App.KBoardFitController;
        var container = App.DomLandmarks.kBoardContainer;

        container.classList.add("resizing");
        container.classList.remove("fit-w");
        container.classList.add("fit-h");

        var activeKBoard = App.DomLandmarks.activeKBoard;
        if (activeKBoard.classList.contains("longRow")) {
            controller.longRowKBoard = activeKBoard;
        } else {
            activeKBoard.style.display = "none";
            controller.longRowKBoard.style.display = "block";
        }

        setTimeout(controller.controlSize, 33, ++controller.rId);
    },

    controlSize: function (resizeId) {
        var controller = App.KBoardFitController;
        if (resizeId !== controller.rId) {
            return;
        }

        var kBoard = controller.longRowKBoard;
        var container = App.DomLandmarks.kBoardContainer;
        var boxSize = kBoard
                .firstElementChild
                .firstElementChild
                .firstElementChild
                .offsetWidth;

        var fit = true;
        for (var sections = kBoard.children, i = 0; fit && i < sections.length; i++) {
            for (var rows = sections[i].children, j = 0; fit && j < rows.length; j++) {
                var row = rows[j];
                if (row.offsetHeight >= 2 * boxSize || row.offsetWidth >= container.offsetWidth) {
                    container.classList.add("fit-w");
                    container.classList.remove("fit-h");
                    fit = false;
                }
            }
        }

        if (kBoard !== App.DomLandmarks.activeKBoard) {
            kBoard.style.display = "none";
            App.DomLandmarks.activeKBoard.style.removeProperty("display");
        }
        container.classList.remove("resizing");
    },

    viewHandler: function (view) {
        if (view === "workspace") {
            this.resizeHandler();
        }
    }

};
