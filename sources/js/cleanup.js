
/* global App */

App.cleanUp = function () {
    window.removeEventListener("load", App.run);
    delete App.Constructor;
    delete App.MenuBuilder;
    delete App.KBoardBuilder;
    delete App.DomEventAssigner;
    delete App.run;
    delete App.cleanUp;
};
