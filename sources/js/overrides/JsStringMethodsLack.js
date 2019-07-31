
/* global App */

App.overrides.before.JsStringMethodsLack = {

    test: function () {
        this.hasSw = "".startsWith;
        this.hasEw = "".endsWith;

        return !(this.hasSw && this.hasEw);
    },

    run: function () {
        if (!this.hasSw) {
            String.prototype.startsWith = function (searchString) {
                return this.substr(0, searchString.length) === searchString;
            };
        }

        if (!this.hasEw) {
            String.prototype.endsWith = function (searchString) {
                return this.substr(this.length - searchString.length) === searchString;
            };
        }
    }

};
