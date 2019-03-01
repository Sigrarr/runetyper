
/* global App, findMany */

App.cleanUp = function () {
    delete App.Constructor;
    delete App.MenuBuilder;
    delete App.KBoardBuilder;
    delete App.DomEventAssigner;
    delete App.run;
    delete App.cleanUp;

    window.removeEventListener("load", App.run);

    var protoNodes = findMany(".proto");
    for (var i = 0; i < protoNodes.length; i++) {
        protoNodes[i].parentNode.removeChild(protoNodes[i]);
    }
};
