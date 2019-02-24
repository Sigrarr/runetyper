"use strict";

var App = {};

include("lib/helpers.js");
include("lib/Updater.js");

include("run.js");
include("cleanup.js");

window.addEventListener("load", App.run);
