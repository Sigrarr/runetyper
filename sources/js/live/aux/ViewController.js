/* global App, getById */

App.ViewController = {

    scrollCheck: null,

    get requestedView() {
        return this.isInfoSectionHash(window.location.hash) ? "info" : "workspace";
    },

    viewHandler: function (view) {
        this.clearScrollCheck();
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

                App.DomMarks.goTopButton.classList.remove("active");
                break;
        }
    },

    isInfoSectionHash: function (hash, confirmed) {
        return hash === "#info" || (hash.charAt(1) === 'i' && (confirmed || getById(hash)));
    },

    scrollHandler: function () {
        var buttonClasses = App.DomMarks.goTopButton.classList;
        document.documentElement.scrollTop > window.innerHeight ?
                buttonClasses.add("active") : buttonClasses.remove("active");
    },

    clearScrollCheck: function () {
        if (this.scrollCheck !== null) {
            clearInterval(this.scrollCheck);
            this.scrollCheck = null;
        }
    }

};
