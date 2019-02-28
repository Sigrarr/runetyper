
/* global App, Updater, findElement */

App.run = function () {
    console.log("@run");

    App.KBoardProvider.container = findElement("#kboard-space");
    App.Constructor.buildLayouts();
    App.Constructor.buildAlphabets();
    App.DomEventAssigner.initializeKBoards();
    App.DomEventAssigner.initializeMenuSelects();

    App.WritingProcessor.textArea = findElement("#output");
    App.DomEventAssigner.initializeWritingOutput();

    Updater.register("alphabet", App.KBoardProvider);
    Updater.register("alphabet", App.Literator);
    Updater.register("layout", App.Literator);
    for (var t in Updater.topics) {
        Updater.registerDomReceivers(Updater.topics[t].name);
    }
    Updater.push("alphabet", 0);
    Updater.push("layout", 0);

    App.cleanUp();
};
