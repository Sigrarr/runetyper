
/* global App, Updater */

App.run = function () {
    console.log("@run");

    App.Constructor.buildAlphabets();
    App.Constructor.buildLayouts();
    App.DomEventAssigner.initializeAlphabetSelector();
    App.DomEventAssigner.initializeXCharsSelector();

    App.WritingProcessor.textArea = findElement("#output");
    App.DomEventAssigner.initializeWritingOutput();

    Updater.register("alphabet", App.Literator);
    Updater.register("layout", App.Literator);
    for (var t in Updater.topics) {
        Updater.registerDomReceivers(Updater.topics[t].name);
    }
    Updater.push("alphabet", 0);
    Updater.push("layout", 0);

    App.cleanUp();
};
