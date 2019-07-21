
/* global App, Updater, Env, findOne, removeNode, timePts */

App.run = function () {
    timePts.run0 = Date.now();

    App.Writer.textArea = findOne("#output");
    App.DomMarks.kBoardSpace = findOne("#kboard-space");
    App.DomMarks.editorSpace = findOne("#editor-space");
    App.DomMarks.alphSelectLi = findOne("#selector-alphabet");
    App.DomMarks.xCharsSelectLi = findOne("#selector-xchars");
    App.DomMarks.layoutSelectLi = findOne("#selector-layout");
    App.DomMarks.captionsCycleLi = findOne("#cycle-captions");
    App.DomMarks.saveTextButton = findOne("#save-text-button");
    App.DomMarks.goTopButton = findOne("#go-top");

    App.DeviceController.initialize();
    App.Constructor.buildLayouts();
    App.Constructor.buildAlphabets();
    App.Constructor.buildKeyHeadSets();
    App.EventAssigner.initializeKeyboardEvents();
    App.EventAssigner.initializeXCharButtonClicks();
    App.EventAssigner.initializeMenuClicks();
    App.EventAssigner.initializeResizeHandling();
    App.FitController.initialize();

    Updater.register(App.Storage, '_');
    Updater.register(App.DeviceController, "device");
    Updater.register(App.DomMarks, "alphabet");
    Updater.register(App.Literator, "alphabet");
    Updater.register(App.Literator, "layout");
    Updater.register(App.Commands, "command");
    Updater.register(App.ViewController, "view");
    Updater.register(App.FitController, "view");
    Updater.register(App.FitController, "alphabet");
    Updater.register(App.FitController, "kbmode");
    Updater.register(App.OutFontSizeController, "fontsize");
    Updater.confirmTopic("captions");
    Updater.confirmTopic("xfont");
    Updater.confirmTopic("theme");
    Updater.confirmTopic("toolbar");
    Updater.confirmTopic("loadable_text");
    Updater.confirmTopic("fit");
    for (var t in Updater.topics) {
        Updater.registerDomReceivers(Updater.topics[t].name);
    }

    var primaryDefaults = {
        "device": App.device,
        "alphabet": 0,
        "layout": 0,
        "xfont": "noto",
        "kbmode": "auto",
        "toolbar": App.touchDev() ? "off" : "on",
        "captions": App.touchDev() ? "off" : "roman",
        "theme": App.touchDev() ? "dark" : "bright"
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
    App.MsgController.initialize();
    App.fillEmail();
    App.buildOutline(2);

    for (var key in App.overrides) {
        var override = App.overrides[key];
        if (override.test()) {
            console.log("@override", key);
            override.run();
        }
    }

    timePts.run1 = Date.now();

    if (Env.ok) {
        setTimeout(function () {
            findOne("#loader").classList.add("fading");
            setTimeout(function () {
                removeNode(findOne("#loader"));
                document.body.classList.remove("sup-loader");
            }, 500);
        }, Math.max(0, 500 - (timePts.run1 - timePts.t0)));
    }

    App.cleanUp();
};
