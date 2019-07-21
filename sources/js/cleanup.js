
/* global App, removeNode, timePts */

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

    var tmpNodes = findMany(".tmp");
    while (tmpNodes.length > 0) {
        removeNode(tmpNodes[0]);
    }

    timePts.t1 = Date.now();
    console.log("@ready", (timePts.t1 - timePts.t0) + "ms");
};
