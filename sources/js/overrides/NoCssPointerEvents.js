
/* global App, findActiveChild */

App.overrides.NoCssPointerEvents = {

    test: function () {
        return !("pointerEvents" in document.body.style);
    },

    run: function () {
        App.DomMarks.kBoardSpace.addEventListener("click", function (event) {
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
