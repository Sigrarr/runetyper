
/* global App */

App.overrides.before.JsScrollingElementLack = {

    test: function () {
        return !document.scrollingElement;
    },

    run: function () {
        document.scrollingElement = document.documentElement;
    }

};
