
/* global App */

App.cleanUp = function () {
    window.removeEventListener("load", App.run);
    delete App.run;
    delete App.cleanUp;
};
