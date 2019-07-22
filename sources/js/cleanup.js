
/* global App, Updater, removeNode, setProperties, timePts */

App.cleanUp = function () {

    window.removeEventListener("load", App.run);

    delete App.overrides;
    delete App.Constructor;
    delete App.MenuBuilder;
    delete App.KBoardBuilder;
    delete App.EventAssigner;
    delete App.fillEmail;
    delete App.buildOutline;
    delete App.run;
    delete App.cleanUp;

    setProperties(Updater.topics.device.receivers, {
        attr: {},
        class: [],
        children: []
    });

    var tmpNodes = findMany(".tmp");
    while (tmpNodes.length > 0) {
        var node = tmpNodes[0];
        removeNode(node);
        for (var key in App.DomMarks) {
            if (App.DomMarks[key] === node) {
                delete App.DomMarks[key];
                break;
            }
        }
    }

    timePts.t1 = Date.now();
    console.log("@ready", (timePts.t1 - timePts.t0) + "ms");
};
