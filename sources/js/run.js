
/* global App, Updater, findOne */

App.run = function () {
    console.log("@run");

    App.KBoardProvider.container = findOne("#kboard-space");
    App.Constructor.buildLayouts();
    App.Constructor.buildAlphabets();
    App.EventAssigner.initializeKBoards();
    App.EventAssigner.initializeClickControls();

    App.WritingProcessor.textArea = findOne("#output");
    App.EventAssigner.initializeWritingOutput();

    Updater.register("_update", App.Storage);
    Updater.register("alphabet", App.KBoardProvider);
    Updater.register("alphabet", App.Literator);
    Updater.register("layout", App.Literator);
    Updater.register("view", App.UrlHandler);
    Updater.confirmTopic("subtitles");
    for (var t in Updater.topics) {
        Updater.registerDomReceivers(Updater.topics[t].name);
    }

    var nonZeroDefaults = {"subtitles": "trans"};
    for (var t in Updater.topics) {
        var topicName = Updater.topics[t].name;
        if (App.Storage.isAllowed(topicName)) {
            Updater.push(
                    topicName,
                    App.Storage.get(topicName) || nonZeroDefaults[topicName] || 0
            );
        }
    }

    App.fillEmail();
    App.cleanUp();
    Updater.push("view", App.UrlHandler.requestedView);
};
