
/* global App, Updater, Env, findOne, removeNode */

App.run = function () {
    console.log("@run");

    App.DomLandmarks.kBoardContainer = findOne(".kboard-space");
    App.Writer.textArea = findOne("#output");
    App.DomLandmarks.alphSelectLi = findOne(".selector-alphabet");
    App.DomLandmarks.xCharsSelectLi = findOne(".selector-xchars");
    App.DomLandmarks.layoutSelectLi = findOne(".selector-layout");
    App.DomLandmarks.subtitlesSwitchLi = findOne(".switch-subtitles");
    App.DomLandmarks.saveTextButton = findOne("#save-text-button");

    App.Constructor.buildLayouts();
    App.Constructor.buildAlphabets();
    App.Constructor.buildKeyHeadSets();
    App.EventAssigner.initializeKeyboardEvents();
    App.EventAssigner.initializeMenuClicks();
    App.EventAssigner.initializeXCharButtonClicks();

    Updater.register('_', App.Storage);
    Updater.register("alphabet", App.DomSignaler);
    Updater.register("alphabet", App.Literator);
    Updater.register("layout", App.Literator);
    Updater.register("command", App.Commands);
    Updater.register("view", App.UrlHandler);
    Updater.register("fontsize", App.OutFontSizeController);
    Updater.confirmTopic("subtitles");
    Updater.confirmTopic("xfont");
    Updater.confirmTopic("theme");
    Updater.confirmTopic("toolbar");
    Updater.confirmTopic("loadable_text");
    for (var t in Updater.topics) {
        Updater.registerDomReceivers(Updater.topics[t].name);
    }

    var primaryDefaults = {
        "alphabet": 0,
        "layout": 0,
        "toolbar": "on",
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

    App.DomSignaler.initialize();
    App.fillEmail();

    for (var i in App.overrides) {
        var override = App.overrides[i];
        if (override.test()) {
            console.log("@override:", override.message);
            override.run();
        }
    }

    if (Env.ok) {
        removeNode(findOne("#loader"));
    }

    App.cleanUp();
};
