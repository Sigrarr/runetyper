
/* global App, Updater, Env, findOne, removeNode */

App.run = function () {
    console.log("@run");

    App.KBoardSignaler.container = findOne(".kboard-space");
    App.Writer.textArea = findOne("#output");
    App.MenuProvider.alphSelectLi = findOne(".selector-alphabet");
    App.MenuProvider.xCharsSelectLi = findOne(".selector-xchars");
    App.MenuProvider.layoutSelectLi = findOne(".selector-layout");
    App.MenuProvider.subtitlesSwitchLi = findOne(".switch-subtitles");

    App.Constructor.buildLayouts();
    App.Constructor.buildAlphabets();
    App.EventAssigner.initializeKeyboardEvents();
    App.EventAssigner.initializeControlsClicks();
    App.EventAssigner.initializeKBoardsClicks();

    Updater.register('_', App.Storage);
    Updater.register("alphabet", App.KBoardSignaler);
    Updater.register("alphabet", App.Literator);
    Updater.register("layout", App.Literator);
    Updater.register("view", App.UrlHandler);
    Updater.confirmTopic("subtitles");
    Updater.confirmTopic("xfont");
    Updater.confirmTopic("theme");
    for (var t in Updater.topics) {
        Updater.registerDomReceivers(Updater.topics[t].name);
    }

    var primaryDefaults = {
        "alphabet": 0,
        "layout": 0,
        "subtitles": "trans",
        "theme": "bright",
        "xfont": "noto"
    };

    for (var topicName in primaryDefaults) {
        Updater.push(
                topicName,
                App.Storage.get(topicName) || primaryDefaults[topicName]
        );
    }

    for (var t in Updater.topics) {
        var topicName = Updater.topics[t].name;
        if (App.Storage.passesTopic(topicName)
                && !primaryDefaults.hasOwnProperty(topicName)) {
            Updater.push(
                    topicName,
                    App.Storage.get(topicName) || 0
            );
        }
    }
    Updater.push("view", App.UrlHandler.requestedView);

    App.KBoardSignaler.initialize();
    App.fillEmail();

    if (Env.browser === "ms") {
        App.Ms.runOverride();
    }

    if (Env.ok) {
        removeNode(findOne("#loader"));
    }

    App.cleanUp();
};
