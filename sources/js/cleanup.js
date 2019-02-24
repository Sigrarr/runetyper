
/* global App */

App.cleanUp = function () {
    window.removeEventListener("load", App.run);
    delete App.Constructor;
    delete App.run;
    delete App.cleanUp;
};
