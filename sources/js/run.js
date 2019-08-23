
/* global App, Updater, Env, getById, timestamps */

App.run = function () {
    timestamps.run0 = Date.now();

    for (var key in App.overrides.before) {
        var override = App.overrides.before[key];
        if (override.test()) {
            console.log("@" + key);
            override.run();
        }
    }

    App.Writer.init(getById("output-" + App.Dev.name));
    App.DomMarks.init();
    App.ClickEvents.init();
    App.ClickRepeater.init();
    App.Dev.touch && App.Selection.init();
    App.FitController.init();

    App.Constructor.run();
    App.EventAssigner.run();

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

    App.DomSignaler.init();
    App.Messages.init();
    App.OutFontResizer.init();
    App.buildOutline(2);

    for (var key in App.overrides.after) {
        var override = App.overrides.after[key];
        if (override.test()) {
            console.log("@" + key);
            override.run();
        }
    }

    timestamps.run1 = Date.now();

    if (Env.ok) {
        App.removeLoader();
    }

    App.cleanUp();
};
