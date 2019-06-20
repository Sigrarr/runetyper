
/* global App, findOne, createElement, removeNode */

App.FitController = {

    setting: null,
    lock: false,
    repeat: false,
    compact: false,
    compactRet: false,
    allFitClasses: ["fit-w", "fit-h", "fit-max", "compact"],
    boxMaxSize: 0,
    boxMinSize: 0,

    fit: function () {
        var controller = App.FitController;
        if (controller.lock && !controller.compactRet) {
            controller.repeat = true;
            return;
        }
        controller.lock = true;

        var container = App.DomLandmarks.kBoardContainer;
        var narrowScreen = Math.abs(window.innerWidth - container.offsetWidth) < 100;

        container.classList.add("resizing");

        var method;
        var mKBoard;
        var mParam;
        var fitClass;

        if (controller.compactRet || controller.setting === "compact") {
            controller.compact = true;
            controller.compactRet = false;
            method = controller.fitCompact;
            mKBoard = App.DomLandmarks.activeKBoard;
            mParam = narrowScreen;
            fitClass = "compact";
        } else {
            controller.compact = false;
            if (narrowScreen) {
                method = controller.fitStdNarrowScr;
                mKBoard = findOne(".tall");
                fitClass = "fit-w";
            } else {
                method = controller.fitStdWideScr;
                mKBoard = findOne(".wide");
                fitClass = "fit-h";
            }
            mParam = mKBoard.firstElementChild.firstElementChild.firstElementChild;
        }

        controller.preset(mKBoard, fitClass);
        setTimeout(method, 0, controller, container, mKBoard, mParam);
    },

    fitCompact: function (controller, container, mKBoard, narrowScreen) {
        var kBoardStyle = getComputedStyle(mKBoard);
        var effectiveHeight = parseInt(kBoardStyle.getPropertyValue("padding-top"))
                + parseInt(kBoardStyle.getPropertyValue("padding-bottom"));

        for (var sections = mKBoard.children, i = 0; i < sections.length; i++) {
            for (var rows = sections[i].children, j = 0; j < rows.length; j++) {
                effectiveHeight += rows[j].offsetHeight;
            }
        }
        var containerFree = container.offsetHeight - effectiveHeight;

        if (narrowScreen) {
            var outputContainer = App.DomLandmarks.outputContainer;
            outputContainer.style.height = outputContainer.offsetHeight + containerFree + "px";
        } else {
            mKBoard.style.top = (containerFree / 2) + "px";
        }

        controller.release(container, mKBoard);
    },

    fitStdNarrowScr: function (controller, container, mKBoard, box) {
        if (mKBoard.offsetHeight >= container.offsetHeight) {
            container.classList.remove("fit-w");
            container.classList.add("fit-h");
        }

        setTimeout(controller.finalizeStd, 0, controller, container, mKBoard, box);
    },

    fitStdWideScr: function (controller, container, mKBoard, box) {
        var boxSize = box.offsetHeight;
        var fit = true;

        for (var sections = mKBoard.children, i = 0; fit && i < sections.length; i++) {
            for (var rows = sections[i].children, j = 0; fit && j < rows.length; j++) {
                var row = rows[j];
                if (row.offsetHeight >= 2 * boxSize || row.offsetWidth >= container.offsetWidth) {
                    container.classList.remove("fit-h");
                    container.classList.add("fit-w");
                    fit = false;
                }
            }
        }

        setTimeout(controller.finalizeStd, 0, controller, container, mKBoard, box);
    },

    finalizeStd: function (controller, container, mKBoard, box) {
        var boxWidth = box.offsetWidth;

        if (controller.setting === "auto" && boxWidth < controller.boxMinSize) {
            controller.compactRet = true;
            controller.fit();
            return;
        } else if (boxWidth >= controller.boxMaxSize) {
            container.classList.remove("fit-w", "fit-h");
            container.classList.add("fit-max");
        }

        controller.release(container, mKBoard);
    },

    release: function (container, mKBoard) {
        var aKBoard = App.DomLandmarks.activeKBoard;
        if (mKBoard !== aKBoard) {
            mKBoard.style.display = "none";
            aKBoard.style.removeProperty("display");
        }

        this.lock = false;
        if (this.repeat) {
            this.repeat = false;
            this.fit();
        } else {
            container.classList.remove("resizing");
        }
    },

    preset: function (mKBoard, fitClass) {
        var landmarks = App.DomLandmarks;

        landmarks.outputContainer.style.removeProperty("height");

        var kBoardContainerClasses = landmarks.kBoardContainer.classList;
        var allFitClasses = this.allFitClasses;
        for (var i in allFitClasses) {
            if (allFitClasses[i] !== fitClass) {
                kBoardContainerClasses.remove(allFitClasses[i]);
            }
        }
        kBoardContainerClasses.add(fitClass);

        var kBoards = landmarks.kBoards;
        for (var i in kBoards) {
            if (kBoards[i] !== mKBoard) {
                kBoards[i].style.display = "none";
            }
            kBoards[i].style.removeProperty("top");
        }
        mKBoard.style.removeProperty("display");
    },

    viewHandler: function (view) {
        if (view === "workspace") {
            this.fit();
        }
    },

    alphabetHandler: function () {
        this.alphabetHandler = function () {
            if (this.compact) {
                setTimeout(this.fit, 0);
            }
        };
    },

    kbmodeHandler: function (kbmode) {
        this.setting = kbmode;
        this.kbmodeHandler = function (kbmode) {
            this.setting = kbmode;
            this.fit();
        };
    },

    initialize: function () {
        var probeBox = createElement("div", ["xletter-box", "extremes-probe"]);
        document.body.appendChild(probeBox);
        var probeBoxStyle = getComputedStyle(probeBox);
        this.boxMaxSize = parseInt(probeBoxStyle.getPropertyValue("max-width"));
        this.boxMinSize = parseInt(probeBoxStyle.getPropertyValue("min-width"));
        removeNode(probeBox);
        delete this.initialize;
    }

};
