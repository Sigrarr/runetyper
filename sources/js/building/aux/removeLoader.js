
/* global App, getById, timestamps */

App.removeLoader = function () {
    setTimeout(function () {
        getById("loader").classList.add("fading");
        setTimeout(function () {
            removeNode(getById("loader"));
            document.body.classList.remove("sup-loader");
        }, 500);
    }, Math.max(0, 500 - (timestamps.run1 - timestamps.head)));
};
