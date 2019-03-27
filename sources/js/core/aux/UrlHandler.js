
/* global App */

App.UrlHandler = {

    requestedView: window.location.hash === "#information" ? "information" : "workspace",

    viewHandler: function (view) {
        if (view === "information") {
            window.location.hash = "#information";
        } else if (window.location.hash) {
            window.location.hash = "";
        }
    }

};
