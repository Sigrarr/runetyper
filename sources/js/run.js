
/* global App, Updater */

App.run = function () {
    console.log("@run");

    Updater.register("alphabet", App.Literator);
    Updater.register("layout", App.Literator);

    Updater.push("alphabet", 0);
    Updater.push("layout", 0);

    App.cleanUp();
};
