
var Env = {

    ok: true,

    lang: document.documentElement.getAttribute("lang"),

    browser: (navigator.userAgent.indexOf("Edge") >= 0
            || navigator.userAgent.indexOf("MSIE") >= 0) ? "ms" : "base"

};
