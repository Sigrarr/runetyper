"use strict";

include("Env.js");
include("lib/Updater.js");
include("lib/helpers.js");

var App = {
    overrides: {
        before: {},
        after: {}
    }
};

include("live/base/Storage.js");
include("live/base/Dev.js");
include("live/Literator.js");
include("live/Writer.js");
include("live/Commands.js");
include("live/DomMarks.js");
include("live/aux/DomSignaler.js");
include("live/aux/ViewController.js");
include("live/aux/FitController.js");
include("live/aux/Messages.js");
include("live/aux/OutFontResizer.js");
include("live/aux/SelectsController.js");
include("live/aux/ClickEvents.js");
include("live/aux/ClickRepeater.js");
include("live/aux/Selection.js");
include("building/Constructor.js");
include("building/MenuBuilder.js");
include("building/KBoardBuilder.js");
include("building/EventAssigner.js");
include("building/aux/buildOutline.js");
include("building/aux/removeLoader.js");
include("overrides/NoGoOnCssFlexLack.js");
include("overrides/JsStringMethodsLack.js");
include("overrides/JsSetRangeTextLack.js");
include("overrides/MsKeyboardEvents.js");
include("overrides/TouchDevCaptions.js");

include("run.js");
include("cleanup.js");

App.Constructor.enterAlphabets(
        include("/data/alphabets/00-elder_futhark.json"),
        include("/data/alphabets/01-anglo-saxon_futhorc.json"),
        include("/data/alphabets/02-younger_futhark.json"),
        include("/data/alphabets/03-high-medieval_runes.json"),
        include("/data/alphabets/04-gothic_alphabet.json")
);

if (App.Dev.std) {
    App.Constructor.enterLayouts(
            include("/data/layouts/00-uni.json"),
            include("/data/layouts/01-da-no.json"),
            include("/data/layouts/02-de.json"),
            include("/data/layouts/03-fo.json"),
            include("/data/layouts/04-is.json"),
            include("/data/layouts/05-sv.json")
    );
}

window.addEventListener("load", App.run);
