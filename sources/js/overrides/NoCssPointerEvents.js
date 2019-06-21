
/* global App, findActiveChild */

App.overrides.NoCssPointerEvents = {

    test: function () {
        return typeof document.body.style.pointerEvents === "undefined";
    },

    depend: [],

    run: function () {
        App.DomLandmarks.kBoardContainer.addEventListener("click", function (event) {
            if (!App.FitController.compact) {
                return;
            }

            var targetIsBox = false;
            for (var i = 0, target = event.target; i < 4 && target && !targetIsBox; i++) {
                (targetIsBox = target.classList.contains("xletter-box")) || (target = target.parentNode);
            }

            if (targetIsBox) {
                (findActiveChild(target) || target.firstElementChild).click();
            }
        });
    }

};
