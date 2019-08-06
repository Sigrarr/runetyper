
/* global App, Updater, removeNode, getByClass, setProperties, timestamps */

App.cleanUp = function () {
    timestamps.clean0 = Date.now();
    window.removeEventListener("load", App.run);

    delete App.overrides;
    delete App.Constructor;
    delete App.MenuBuilder;
    delete App.KBoardBuilder;
    delete App.EventAssigner;
    delete App.buildOutline;
    delete App.removeLoader;
    delete App.run;
    delete App.cleanUp;
    for (var key in App) {
        delete App[key].init;
    }

    setProperties(Updater.topics.device.receivers, {
        attr: {},
        class: [],
        children: []
    });

    var tmpNodes = getByClass("tmp");
    while (tmpNodes.length > 0) {
        removeNode(tmpNodes[0]);
    }

    timestamps.clean1 = Date.now();
    console.log("@ready", (timestamps.clean1 - timestamps.head) + "ms");
};
