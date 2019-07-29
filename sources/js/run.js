
/* global App, Updater, Env, getById, removeNode, setProperties, timePts */

App.run = function () {
    timePts.run0 = Date.now();

    App.Writer.initialize(getById("output-" + App.Dev.name));
    setProperties(App.DomMarks, {
        kBoardSpace: getById("kboard-space"),
        editorSpace: getById("editor-space"),
        xCharsSelectLi: getById("selector-xchars"),
        captionsCycleLi: getById("cycle-captions"),
        saveTextButton: getById("save-text-button"),
        goTopButton: getById("go-top")
    });

    App.Constructor.run();
    App.EventAssigner.run();
    App.FitController.initialize();

    Updater.startTopics([
        "device", "alphabet", "layout", "command", "view", "kbmode",
        "captions", "xfont", "theme", "toolbar", "loadable_text", "fit"
    ]);

    Updater.register(App.Storage, '_');
    Updater.register(App.Dev, "device");
    if (App.Dev.std) {
        Updater.register(App.Literator, "alphabet");
        Updater.register(App.Literator, "layout");
    }
    Updater.register(App.Commands, "command");
    Updater.register(App.ViewController, "view");
    Updater.register(App.FitController, "view");
    Updater.register(App.FitController, "alphabet");
    Updater.register(App.FitController, "kbmode");
    for (var t in Updater.topics) {
        Updater.registerDomReceivers(Updater.topics[t].name);
    }

    var primaryDefaults = {
        device: App.Dev.name,
        alphabet: 0,
        layout: 0,
        xfont: "noto",
        kbmode: "auto",
        toolbar: App.Dev.std ? "on" : "off",
        captions: App.Dev.std ? "roman" : "off",
        theme: App.Dev.std ? "bright" : "dark"
    };

    for (var topicName in primaryDefaults) {
        Updater.push(
                topicName,
                App.Storage.get(topicName) || primaryDefaults[topicName]
        );
    }

    for (var t in Updater.topics) {
        var topicName = Updater.topics[t].name;
        if (App.Storage.passesTopic(topicName) && !(topicName in primaryDefaults)) {
            Updater.push(
                    topicName,
                    App.Storage.get(topicName) || 0
            );
        }
    }
    Updater.push("view", App.ViewController.requestedView);

    App.DomSignaler.initialize();
    App.MsgController.initialize();
    App.OutFontSizeController.initialize();
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
        App.removeLoader();
    }

    App.cleanUp();
};
