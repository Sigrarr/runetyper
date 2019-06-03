
/* global App, Env, removeNode, T */

App.cleanUp = function () {

    delete App.overrides;
    delete App.Constructor;
    delete App.MenuBuilder;
    delete App.KBoardBuilder;
    delete App.EventAssigner;
    delete App.fillEmail;
    delete App.buildOutline;
    delete App.run;
    delete App.cleanUp;

    window.removeEventListener("load", App.run);

    var prototypeNodes = findMany(".prototype");
    for (var i = 0; i < prototypeNodes.length; i++) {
        removeNode(prototypeNodes[i]);
    }

    T.t1 = Date.now();
    console.log("@ready", (T.t1 - T.t0) + "ms");
};
