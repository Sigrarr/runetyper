
/* global App, getById, timePts */

App.removeLoader = function () {
    setTimeout(function () {
        getById("loader").classList.add("fading");
        setTimeout(function () {
            removeNode(getById("loader"));
            document.body.classList.remove("sup-loader");
        }, 500);
    }, Math.max(0, 500 - (timePts.run1 - timePts.t0)));
};
