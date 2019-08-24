
/* global App, Updater, getOneOf, newElement, removeNode */

App.Fitter = {

    setting: null,
    lock: false,
    repeat: false,
    compact: false,
    compactRet: false,
    allFitClasses: ["fit-w", "fit-h", "fit-max", "compact"],
    boxMaxSize: 0,
    boxMinSize: 0,

    fit: function () {
        var fitter = App.Fitter;
        if (fitter.lock && !fitter.compactRet) {
            fitter.repeat = true;
            return;
        }
        fitter.lock = true;

        document.body.style.height = window.innerHeight + "px";

        var container = App.DomMarks.kBoardSpace;
        var narrowScreen = Math.abs(window.innerWidth - container.offsetWidth) < 100;

        container.classList.add("resizing");

        var method;
        var mKBoard;
        var mParam;
        var fitClass;

        if (fitter.compactRet || fitter.setting === "compact") {
            fitter.compact = true;
            fitter.compactRet = false;
            method = fitter.fitCompact;
            mKBoard = App.DomMarks.activeKBoard;
            mParam = narrowScreen;
            fitClass = "compact";
        } else {
            fitter.compact = false;
            if (narrowScreen) {
                method = fitter.fitStdNarrowScr;
                mKBoard = getOneOf("tall");
                fitClass = "fit-w";
            } else {
                method = fitter.fitStdWideScr;
                mKBoard = getOneOf("wide");
                fitClass = "fit-h";
            }
            mParam = mKBoard.firstElementChild.firstElementChild.firstElementChild;
        }

        fitter.preset(mKBoard, fitClass);
        setTimeout(method, 0, fitter, container, mKBoard, mParam);
    },

    fitCompact: function (fitter, container, mKBoard, narrowScreen) {
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
            var editorSpace = App.DomMarks.editorSpace;
            editorSpace.style.height = editorSpace.offsetHeight + containerFree + "px";
        } else {
            mKBoard.style.top = (containerFree / 2) + "px";
        }

        fitter.release(container, mKBoard);
    },

    fitStdNarrowScr: function (fitter, container, mKBoard, box) {
        if (mKBoard.offsetHeight >= container.offsetHeight) {
            container.classList.remove("fit-w");
            container.classList.add("fit-h");
        }

        setTimeout(fitter.finalizeStd, 0, fitter, container, mKBoard, box);
    },

    fitStdWideScr: function (fitter, container, mKBoard, box) {
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

        setTimeout(fitter.finalizeStd, 0, fitter, container, mKBoard, box);
    },

    finalizeStd: function (fitter, container, mKBoard, box) {
        var boxWidth = box.offsetWidth;

        if (fitter.setting === "auto" && boxWidth < fitter.boxMinSize) {
            fitter.compactRet = true;
            fitter.fit();
            return;
        } else if (boxWidth >= fitter.boxMaxSize) {
            container.classList.remove("fit-w", "fit-h");
            container.classList.add("fit-max");
        }

        fitter.release(container, mKBoard);
    },

    release: function (container, mKBoard) {
        var aKBoard = App.DomMarks.activeKBoard;
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
            Updater.push("fit", 1);
        }
    },

    preset: function (mKBoard, fitClass) {
        var landmarks = App.DomMarks;

        landmarks.editorSpace.style.removeProperty("height");

        var kBoardSpaceClasses = landmarks.kBoardSpace.classList;
        var allFitClasses = this.allFitClasses;
        for (var i in allFitClasses) {
            if (allFitClasses[i] !== fitClass) {
                kBoardSpaceClasses.remove(allFitClasses[i]);
            }
        }
        kBoardSpaceClasses.add(fitClass);

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

    init: function () {
        var probeBox = newElement("div", ["extremes-probe", "tmp"]);
        document.body.appendChild(probeBox);
        var probeBoxStyle = getComputedStyle(probeBox);
        this.boxMaxSize = parseInt(probeBoxStyle.getPropertyValue("max-width"));
        this.boxMinSize = parseInt(probeBoxStyle.getPropertyValue("min-width"));
    }

};
