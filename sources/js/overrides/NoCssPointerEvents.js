
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

            var target = event.target;
            var p = false;
            for (var i = 0; !p && target && i < 4; i++) {
                p = (target.tagName.toLowerCase() === "p");
                target = target.parentNode;
            }

            if (p && target) {
                (findActiveChild(target) || target.firstElementChild).click();
            }
        });
    }

};
