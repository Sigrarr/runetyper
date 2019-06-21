
var Env = {

    ok: true,

    lang: document.documentElement.getAttribute("lang"),

    browser: (navigator.userAgent.indexOf("Edge") >= 0
            || navigator.userAgent.indexOf("MSIE") >= 0) ? "ms" : "std",

    device: (typeof window.ontouchstart !== "undefined"
            || navigator.maxTouchPoints > 0) ? "touch" : "std",

    stdDev: function () {
        return this.device === "std";
    },

    touchDev: function () {
        return this.device === "touch";
    }

};
