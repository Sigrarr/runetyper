/* global App */

App.ViewController = {

    scrollCheck: null,

    getRequestedView: function () {
        return this.isInfoSectionHash(window.location.hash) ? "info" : "workspace";
    },

    viewHandler: function (view) {
        var hash = window.location.hash;
        switch (view) {
            case "info":
                if (!this.isInfoSectionHash(hash)) {
                    window.location.hash = "info";
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

                App.DomMarks.goTopButton.classList.remove("active");

                break;
        }
    },

    isInfoSectionHash: function (hash, confirmed) {
        return hash === "#info" || (hash.charAt(1) === 'i' && (confirmed || findOne(hash)));
    },

    scrollHandler: function () {
        var buttonClasses = App.DomMarks.goTopButton.classList;
        document.documentElement.scrollTop > window.innerHeight ?
                buttonClasses.add("active") : buttonClasses.remove("active");
    }

};
