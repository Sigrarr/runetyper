
/* global App, Updater, Env, findOne, removeNode, startT */

App.run = function () {
    console.log("@run", (Date.now() - startT) + "ms");

    App.Writer.textArea = findOne("#output");
    App.DomLandmarks.kBoardContainer = findOne(".kboard-space");
    App.DomLandmarks.alphSelectLi = findOne(".selector-alphabet");
    App.DomLandmarks.xCharsSelectLi = findOne(".selector-xchars");
    App.DomLandmarks.layoutSelectLi = findOne(".selector-layout");
    App.DomLandmarks.captionsSwitchLi = findOne(".switch-captions");
    App.DomLandmarks.saveTextButton = findOne("#save-text-button");
    App.DomLandmarks.goTopButton = findOne("#go-top");

    App.Constructor.buildLayouts();
    App.Constructor.buildAlphabets();
    App.Constructor.buildKeyHeadSets();
    App.EventAssigner.initializeKeyboardEvents();
    App.EventAssigner.initializeMenuClicks();
    App.EventAssigner.initializeXCharButtonClicks();
    App.EventAssigner.initializeResizeHandling();

    Updater.register('_', App.Storage);
    Updater.register("alphabet", App.DomLandmarks);
    Updater.register("alphabet", App.Literator);
    Updater.register("layout", App.Literator);
    Updater.register("command", App.Commands);
    Updater.register("view", App.ViewController);
    Updater.register("view", App.KBoardFitController);
    Updater.register("fontsize", App.OutFontSizeController);
    Updater.confirmTopic("captions");
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
        "captions": "roman",
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
    Updater.push("view", App.ViewController.getRequestedView());

    App.DomSignaler.initialize();
    App.fillEmail();
    App.buildOutline(2);

    for (var i in App.overrides) {
        var override = App.overrides[i];
        if (override.test()) {
            console.log("@override:", override.message);
            override.run();
        }
    }

    var deltaT = Date.now() - startT;
    console.log("@built", deltaT + "ms");

    if (Env.ok) {
        setTimeout(function () {
            findOne("#loader").classList.add("fading");
            setTimeout(function () {
                removeNode(findOne("#loader"));
                document.body.classList.remove("sup-loader");
            }, 500);
        }, Math.max(500 - deltaT, 0));
    }

    App.cleanUp();
};
