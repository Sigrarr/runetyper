
/* global App, removeNode, T */

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

    var protoboxNodes = findMany(".protobox");
    while (protoboxNodes.length > 0) {
        removeNode(protoboxNodes[0]);
    }

    T.t1 = Date.now();
    console.log("@ready", (T.t1 - T.t0) + "ms");
};
