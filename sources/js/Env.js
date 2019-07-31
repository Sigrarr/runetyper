
var Env = {

    ok: true,

    lang: document.documentElement.getAttribute("lang"),

    browser: (function () {
        var userAgentString = navigator.userAgent;
        return userAgentString.indexOf("Edge") >= 0
                || userAgentString.indexOf("MSIE") >= 0
                || userAgentString.indexOf("Trident/") >= 0;
    })() ? "ms" : "std",

    device: (typeof window.ontouchstart !== "undefined"
            || navigator.maxTouchPoints > 0) ? "touch" : "std"

};
