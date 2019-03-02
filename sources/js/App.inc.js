"use strict";

include("lib/helpers.js");
include("lib/Updater.js");
include("Env.js");

var App = {};

include("core/Literator.js");
include("core/KBoardProvider.js");
include("core/WritingProcessor.js");
include("core/Constructor.js");
include("dom/MenuBuilder.js");
include("dom/KBoardBuilder.js");
include("dom/EventAssigner.js");
include("aux/UrlHandler.js");

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
        include("../../data/layouts/00-uni.json")
);
