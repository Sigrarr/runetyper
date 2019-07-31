
/* global App, Updater */

App.overrides.after.TouchDevCaptions = {

    test: function () {
        return App.Dev.touch && App.Storage.get("captions") === "keys";
    },

    run: function () {
        Updater.push("captions", "off");
    }

};
