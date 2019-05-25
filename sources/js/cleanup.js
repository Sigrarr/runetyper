
/* global App, Env, removeNode */

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
};
