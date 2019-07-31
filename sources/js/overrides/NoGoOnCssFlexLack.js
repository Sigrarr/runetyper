
/* global App, Env */

App.overrides.before.NoGoOnCssFlexLack = {

    test: function () {
        return !("flex-flow" in document.body.style);
    },

    run: function () {
        Env.ok = false;
        console.error("Deficient browser (indicated by no flex support).");
    }

};
