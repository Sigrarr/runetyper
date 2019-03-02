
/* global App, Updater, findOne */

App.run = function () {
    console.log("@run");

    App.KBoardProvider.container = findOne("#kboard-space");
    App.Constructor.buildLayouts();
    App.Constructor.buildAlphabets();
    App.EventAssigner.initializeKBoards();
    App.EventAssigner.initializeMenuSelects();

    App.WritingProcessor.textArea = findOne("#output");
    App.EventAssigner.initializeWritingOutput();

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
