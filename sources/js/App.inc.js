"use strict";

include("lib/helpers.js");
include("lib/Updater.js");
include("Env.js");

var App = {
    overrides: []
};

include("core/Literator.js");
include("core/Writer.js");
include("core/Commands.js");
include("core/DomLandmarks.js");
include("core/aux/DomSignaler.js");
include("core/aux/Storage.js");
include("core/aux/ViewController.js");
include("core/aux/OutFontSizeController.js");
include("building/Constructor.js");
include("building/MenuBuilder.js");
include("building/KBoardBuilder.js");
include("building/EventAssigner.js");
include("building/aux/fillEmail.js");
include("building/aux/buildOutline.js");
include("overrides/MsKeys.js");
include("overrides/NoSetRangeText.js");

include("run.js");
include("cleanup.js");

window.addEventListener("load", App.run);

App.Constructor.enterAlphabets(
        include("../../data/alphabets/00-elder_futhark.json"),
        include("../../data/alphabets/01-anglo-saxon_futhorc.json"),
        include("../../data/alphabets/02-younger_futhark.json"),
        include("../../data/alphabets/03-high-medieval_runes.json"),
        include("../../data/alphabets/04-gothic_alphabet.json")
);

App.Constructor.enterLayouts(
        include("../../data/layouts/00-uni.json"),
        include("../../data/layouts/01-da-no.json"),
        include("../../data/layouts/02-de.json"),
        include("../../data/layouts/03-fo.json"),
        include("../../data/layouts/04-is.json"),
        include("../../data/layouts/05-sv.json")
);
