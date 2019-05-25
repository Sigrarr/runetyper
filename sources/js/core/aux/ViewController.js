/* global App */

App.ViewController = {

    scrollCheck: null,

    getRequestedView: function () {
        return this.isInfoSectionHash(window.location.hash) ? "information" : "workspace";
    },

    viewHandler: function (view) {
        var hash = window.location.hash;
        switch (view) {
            case "information":
                if (!this.isInfoSectionHash(hash)) {
                    window.location.hash = "information";
                }

                this.scrollCheck = setInterval(this.scrollHandler, 250);

                break;

            case "workspace":
                if (hash.length > 0) {
                    window.location.hash = "";
                }

                if (this.scrollCheck !== null) {
                    clearInterval(this.scrollCheck);
                    this.scrollCheck = null;
                }

                App.DomLandmarks.goTopButton.classList.remove("active");

                break;
        }
    },

    isInfoSectionHash: function (hash) {
        return hash === "#information" || (hash.charAt(1) === "i" && findOne(hash));
    },

    scrollHandler: function () {
        var buttonClasses = App.DomLandmarks.goTopButton.classList;
        document.documentElement.scrollTop > window.innerHeight ?
                buttonClasses.add("active") : buttonClasses.remove("active");
    }

};
